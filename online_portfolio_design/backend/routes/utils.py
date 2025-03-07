"""
This module provides utility functions for:
    - Verifying reCAPTCHA tokens.
    - Parsing dates in various formats, including those with ordinal suffixes.

Dependencies:
    - flask
    - requests
    - re
    - datetime
    - beautifulsoup4
    - selenium
    - Project model (from projects.py [model(s) file])
"""

from flask import current_app  # Import the current_app object from Flask
import requests  # Import the requests library for making HTTP requests
import re  # Import the re module for regular expressions
from datetime import (
    datetime,
)  # Import the datetime class for working with dates and times
from bs4 import BeautifulSoup  # Import BeautifulSoup for parsing HTML and XML
from selenium.webdriver.support.ui import (
    WebDriverWait,
)  # Import WebDriverWait for waiting for elements to appear in Selenium
from selenium.webdriver.support import (
    expected_conditions as EC,
)  # Import expected_conditions for defining conditions to wait for in Selenium
from selenium.webdriver.common.by import (
    By,
)  # Import By for locating elements in Selenium
import random  # Import the random module for generating random numbers
from selenium.webdriver.common.action_chains import (
    ActionChains,
)  # import class for automating low level interactions such as mouse movements, mouse button actions, key press, and context menu interactions
import time  # Import the time module for time-related functions
from backend.models.projects import Project  # Import the Project Model for type hinting


# >>>>> Projects Page-Related >>>>
def remove_ordinal_suffix(date_string: str) -> str:
    """
    Removes ordinal suffixes like 'st', 'nd', 'rd', 'th' from a date string.

    Args:
        date_string (str): A date string that may contain ordinal suffixes.

    Returns:
        str: The cleaned date string without ordinal suffixes.
    """
    return re.sub(
        r"(\d+)(st|nd|rd|th)", r"\1", date_string
    )  # Use the RE sub function to give results


def parse_date(date_string: str) -> datetime:
    """
    Parses a date string after removing ordinal suffixes, attempting multiple formats.

    Args:
        date_string (str): A date string that may include ordinal suffixes.

    Returns:
        datetime: A datetime object representing the parsed date, or datetime.min if parsing fails.
    """
    date_string = remove_ordinal_suffix(date_string).strip()
    # Remove these parts from the date, to parse

    formats = [
        # Formats for the date code, with a variety of options
        "%b %d, %Y",  # Example: Sep 17, 2021
        "%B %d, %Y",  # Example: September 17, 2021
        "%b %d %Y",  # Example: Jun 2 2021
        "%B %d %Y",  # Example: June 2 2021
    ]

    for fmt in formats:
        # for loop to check various formats of date
        try:
            # For the following operation in this file,
            return datetime.strptime(date_string, fmt)
        except ValueError:
            # Value Error
            continue  # Try the next format

    return datetime.min  # Return a default old date if parsing fails


def truncate_html(html: str, length: int = 250) -> str:
    """Truncates HTML content while preserving basic HTML structure.

    Args:
        html (str): The HTML content to truncate.
        length (int, optional): The maximum length of the truncated text. Defaults to 250.

    Returns:
        str: The truncated HTML content.
    """
    soup = BeautifulSoup(html, "html.parser")  # use the BEautifulSoup
    text = soup.get_text()  # use get text command to generate plain text
    truncated_text = text[:length]  # truncate text to the specified length

    # Re-wrap with <i> tags
    truncated_html = f"<i>{truncated_text}...</i>"  # wrap truncated text

    return truncated_html


def get_project_id(project_id: int, ProjectModel) -> Project:
    """Queries the database to retrieve a project by ID."""
    return ProjectModel.query.get(project_id)


def is_valid_project_page(
    page_number: int, total_projects: int, projects_per_page: int
) -> bool:
    """Checks if a project page number is valid."""
    try:
        page_num = int(page_number)
        # Convert it to a digit
        if page_num <= 0:
            # IF it's below 0 then not valid
            return False
        max_page = (total_projects + projects_per_page - 1) // projects_per_page
        # Get the max available pages
        return 1 <= page_num <= max_page
        # Check if it is within range and give back
    except ValueError:
        # Value Error
        return False


def is_valid_project_id(project_id: int, project_query) -> bool:
    """Checks if a project ID exists using a provided project query."""
    try:
        project_id = int(project_id)
        # Get the project and convert to a string
        project = project_query(project_id)  # Use provided query
        # Query from the database to check value
        return project is not None  # Returns True if project exists
        # Check if the project exist and give a bool
    except ValueError:
        # Value Error handling
        return False


def is_valid_project_route(
    path: str,
    total_projects: int,
    projects_per_page: int,
    project_query,
) -> bool:
    """
    Checks if the given path is a valid project route.
    """

    # Regex for /projects or /projects/page/N (where N is a number)
    page_match = re.match(r"^/projects(?:/page/(\d+))?$", path)  # Using regex

    if page_match:
        # If it's /projects or /projects/page/N, validate the page number
        page_number = page_match.group(1)
        # get the group
        if page_number is None:
            # check if the page is supplied or valid
            return True  # Just projects is valid
        else:
            # Validating page number requires knowing total projects
            # If page number is supplied, use the page validation utility
            return is_valid_project_page(page_number, total_projects, projects_per_page)

    # Regex for /projects/ID (where ID is a number)
    id_match = re.match(r"^/projects/(\d+)$", path)  # Using regex
    # regex to get the project ID

    if id_match:
        # If it's /projects/ID, validate the project ID
        project_id = id_match.group(1)
        # use a grouping
        return is_valid_project_id(
            project_id, project_query
        )  # check if the project is within the scope

    return False  # Not a valid project route


# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


# >>>>> CV-Generator Page-Related >>>>>
def click_with_visual_feedback(driver, x_offset: int = 10, y_offset: int = 0) -> bool:
    """
    Clicks near the center of the <body> and places a red dot at the clicked position.

    Args:
        driver: Selenium WebDriver instance.
        x_offset: Small horizontal offset from the body's center.
        y_offset: Small vertical offset from the body's center.

    Returns:
        True if successful, False otherwise.
    """
    try:
        # Try block in the event that any code fails

        # 1. Locate the <body> element
        body = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        # Webdriver, that only moves on if there's an body tag, or fails after 10 seconds

        # 2. Get body size & center coordinates
        size = body.size
        # Get the size of the body element
        center_x = size["width"] // 2
        # half the width, to get the X cord
        center_y = size["height"] // 2
        # half the height to get the Y cord

        # 3. Safely set the size, in order to ensure there's
        # not an error and apply a **small** safe offset
        safe_x = min(center_x + x_offset, size["width"] - 5)
        # Safe X
        safe_y = min(center_y + y_offset, size["height"] - 5)
        # Safe Y

        # 4. Move & Click
        action = ActionChains(driver)
        # action to activate the driver
        action.move_to_element_with_offset(
            body, safe_x - center_x, safe_y - center_y
        ).click().perform()
        # Move to element then perform the click

        # 5. Inject a **red dot marker** at the clicked position
        driver.execute_script(
            f"""
            var dot = document.createElement("div");
            dot.style.position = "fixed";  // Keep it above everything
            dot.style.left = "{safe_x}px";
            dot.style.top = "{safe_y}px";
            dot.style.width = "10px";
            dot.style.height = "10px";
            dot.style.background = "red";
            dot.style.borderRadius = "50%";
            dot.style.zIndex = "9999999";  // Max priority to stay on top
            dot.style.pointerEvents = "none"; // Prevent interference with clicks
            document.body.appendChild(dot);
        """
        )
        # Add the code to create a DOT that we will click on and generate

        return True

    except Exception as e:
        return False


def click_safely_near_body_center(
    driver, x_offset: int = 10, y_offset: int = 0
) -> bool:
    """
    Clicks slightly away from the center of the <body> to dismiss modal pop-ups.

    Args:
        driver: Selenium WebDriver instance.
        x_offset: Small horizontal offset from the body's center.
        y_offset: Small vertical offset from the body's center.

    Returns:
        True if successful, False otherwise.
    """
    try:
        # If any code fails, set the exception to true

        # 1. Locate the <body> element
        body = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        # Looking for the tag, if it's not there in 10 seconds, exit

        # 2. Get body size & center coordinates
        size = body.size
        # Size of the body element
        center_x = size["width"] // 2
        # Center X for clicking purposes
        center_y = size["height"] // 2
        # Center Y for clicking purposes

        # 3. Apply a **small** safe offset to ensure we're within bounds
        safe_x = min(
            center_x + x_offset, size["width"] - 5
        )  # Ensure we don't go out of bounds
        # Make sure code doesnt bug out
        safe_y = min(center_y + y_offset, size["height"] - 5)

        # 4. Move & Click
        action = ActionChains(driver)
        # Calling this class for actions with the diver
        action.move_to_element_with_offset(
            body, safe_x - center_x, safe_y - center_y
        ).click().perform()
        # Peform the click

        return True

    except Exception as e:
        return False


def realistic_mouse_move(driver, element):
    """
    Moves the mouse to a random point within the bounds of an element using ActionChains.

    Args:
        driver: Selenium WebDriver instance.
        element: Selenium WebElement instance to move the mouse to.

    """
    # Get element position and size
    width = element.size["width"]
    # element width
    height = element.size["height"]
    # element height

    # Convert width and height to integers
    width = int(width)
    # height to digit
    height = int(height)
    # width to digit

    # Define random offsets within the element
    x_offset = random.randint(1, width - 1)
    # The random X cord
    y_offset = random.randint(1, height - 1)
    # the Random Y cord

    # Move mouse to the element with a small delay
    action = ActionChains(driver)
    # action for mouse
    action.move_to_element_with_offset(element, x_offset, y_offset).perform()
    # peform the move
    time.sleep(random.uniform(0.1, 0.3))  # Pause after move


def realistic_type(element, text):
    """
    Types text into a given element with realistic delays between each character.

    Args:
        element: Selenium WebElement instance to send keys to.
        text (str): Text to type into element.
    """
    for char in text:
        # for the text, one char at a time
        element.send_keys(char)
        # send what should be written
        time.sleep(random.uniform(0.05, 0.2))  # Adjust delay range as needed
        # adjust the delay to make it look human like


def clean_bmp_text(text: str) -> str:
    """
    Removes characters that are outside the Basic Multilingual Plane (BMP),
    which includes most emoji and certain rare Unicode characters.
    """
    return re.sub(
        r"[^\u0000-\uFFFF]", "", text
    )  # Re Sub with Regex to only clean chars outside BMP


def scroll_down_with_visual_feedback(
    driver, scroll_threshold: int = 500, max_attempts: int = 5
) -> bool:
    """
    Scrolls down dynamically to ensure the latest response bubble in Google AI Studio is visible.

    Args:
        driver: Selenium WebDriver instance.
        scroll_threshold: Number of pixels to scroll down per attempt.
        max_attempts: Max times to scroll down before stopping.

    Returns:
        True if successful, False otherwise.
    """
    try:
        # Try any error during the code, will go to the except

        # Get the initial page height
        last_height = driver.execute_script(
            "return document.body.scrollHeight"
        )  # Getting element for scrolling purposes

        for _ in range(
            max_attempts
        ):  # for loop so it continues if there's new content to try load in again.
            # Scroll down by the threshold amount
            driver.execute_script(
                f"window.scrollBy(0, {scroll_threshold});"
            )  # Scroll down code with the script
            time.sleep(1.5)  # Allow time for elements to load

            # Get the new page height
            new_height = driver.execute_script(
                "return document.body.scrollHeight"
            )  # Get the new element to scroll

            # If height didn't change, assume no more content is loading
            if new_height == last_height:
                # Check that code if there are no more heights
                break

            last_height = new_height  # Update last known height
            # Update this for scrolling purposes

        # Add a red marker at the last scrolled position for debugging
        driver.execute_script(
            f"""
            var marker = document.createElement("div");
            marker.style.position = "fixed";
            marker.style.left = "50%";
            marker.style.top = "{scroll_threshold * max_attempts}px"; 
            marker.style.width = "10px";
            marker.style.height = "10px";
            marker.style.background = "red";
            marker.style.borderRadius = "50%";
            marker.style.zIndex = "9999999";
            marker.style.pointerEvents = "none";
            document.body.appendChild(marker);
            """
        )
        # code to add the indicator to show what parts have been seen.

        return True

    except Exception as e:
        return False


def remove_emojis(text: str) -> str:
    """Removes emojis from a string.

    Args:
        text (str): The input string.

    Returns:
        str: The string with emojis removed.
    """
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  # emoticons
        "\U0001F300-\U0001F5FF"  # symbols & pictographs
        "\U0001F680-\U0001F6FF"  # transport & map symbols
        "\U0001F1E0-\U0001F1FF"  # flags (iOS)
        "\U00002702-\U000027B0"
        "\U000024C2-\U0001F251"
        "]+",
        flags=re.UNICODE,
    )
    # Regex the various emojies and special chars
    return emoji_pattern.sub(r"", text)  # Apply the Regex, with sub chars


# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


# >>>>> CV-Generator + Contact Page-Related >>>>>
def verify_recaptcha(token: str) -> bool:
    """
    Verifies a reCAPTCHA token using Google's reCAPTCHA verification API.

    Args:
        token (str): The reCAPTCHA token received from the client-side.

    Returns:
        bool: True if the verification is successful, False otherwise.
    """
    secret_key = current_app.config.get("RECAPTCHA_PRIVATE_KEY")
    # Getting the secret key for verification
    url = "https://www.google.com/recaptcha/api/siteverify"
    # Calling up the URL
    payload = {"secret": secret_key, "response": token}
    # Payload to be used to ensure code works

    try:
        # Trying for a proper response to the service
        response = requests.post(url, data=payload)
        # Sending to the browser to give result
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
        result = response.json()
        return result.get("success", False)
    except requests.exceptions.RequestException as e:
        return False


# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
