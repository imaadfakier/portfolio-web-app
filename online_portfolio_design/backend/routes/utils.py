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
    - Project model (from projects.py [model(s) file])
"""

from flask import current_app  # Import the current_app object from Flask
import requests  # Import the requests library for making HTTP requests
import re  # Import the re module for regular expressions
from datetime import (
    datetime,
)  # Import the datetime class for working with dates and times
from bs4 import BeautifulSoup  # Import BeautifulSoup for parsing HTML and XML
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


# >>>>> Contact Page-Related >>>>>
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
