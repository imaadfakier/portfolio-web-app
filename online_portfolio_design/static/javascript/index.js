/**
 * @file index.js
 * @description This file contains JavaScript code specific to the home page (index.html).
 * It manages the bubble animation, loading screen effects, and interaction with the page's
 * visual elements. Also controls if the CV-generator should only be visible once loaded.
 */

// ==========================================================================
//  Page Initialization and Scroll Restoration
// ==========================================================================

// Ensure the page always starts at the top when reloaded
window.history.scrollRestoration = "manual";

window.addEventListener("DOMContentLoaded", function () {
  // When the DOM is fully loaded, immediately scroll to the top of the page.
  window.scrollTo(0, 0);
});

window.addEventListener("pageshow", function (event) {
  // This event is triggered when the page is loaded from the cache (back/forward navigation).
  if (event.persisted) {
    // If the page is loaded from the cache:
    window.scrollTo(0, 0); // Ensure the page starts at the top.

    document.querySelectorAll(".btn").forEach((button) => {
      // Re-enable buttons that might have been disabled during a previous session.
      if (button.classList.contains("disabled")) {
        button.disabled = false; // Enable the button.
        preventButtonAbuse(); // Re-attach the event listener to prevent button abuse.
      }
    });
  }
});

// ==========================================================================
//  Event Listener: DOMContentLoaded
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {
  // This event listener ensures that the following code executes only after the
  // entire HTML document has been fully loaded and parsed.

  // ==========================================================================
  //  Bubble Animation
  // ==========================================================================
  /**
   * @description Generates a bubble animation with randomized sizes and positions.
   * Adjusts total bubbles on screen based on browser window/viewport size and
   * bubble colors based on background brightness. Reinitializes bubbles on window resize.
   */

  /** Configuration Variables **/
  const bubbleLifeTime = 20; // Animation duration in seconds: how long each bubble takes to float across the screen.
  let noOfBubbles = 20; // Initial number of bubbles: adjusted based on screen size in `setBubbleCount`.

  const wrapper = document.querySelector(".bubbles");
  if (!wrapper) {
    console.error("Bubbles container (.bubbles) not found!"); // Log an error if the container element is missing.
    return; // Exit the function to prevent further errors.
  }

  let bubbles = []; // Store bubble elements for updating: this array holds references to the created bubble elements.

  // Initialize the bubble effect: call the `init` function to start the bubble animation.
  init();

  /**
   * @function init
   * @description Initializes the bubble effect by clearing old bubbles, setting the bubble count,
   * generating new ones, and updating bubble styles.
   */
  function init() {
    // This function resets and starts the bubble animation.
    clearBubbles(); // Remove any existing bubbles from the container.
    setBubbleCount(); // Determine the appropriate number of bubbles based on the screen size.
    bubbles = []; // Reset the `bubbles` array.

    for (let i = 0; i < noOfBubbles; i++) {
      // Create and append the specified number of bubbles to the container.
      const bubble = createBubble(); // Create a new bubble element.
      wrapper.appendChild(bubble); // Add the bubble to the container.
      bubbles.push(bubble); // Store the bubble in the `bubbles` array.
    }

    updateBubbleStyles(); // Update the bubble styles based on the background brightness.
  }

  /**
   * @function setBubbleCount
   * @description Sets the number of bubbles based on the screen width.
   *   The number of bubbles increases with screen size to maintain a consistent visual density.
   */
  function setBubbleCount() {
    // This function adjusts the number of bubbles based on the screen size.
    const screenWidth = window.innerWidth;

    if (screenWidth >= 1200) {
      noOfBubbles = 100; // Desktop: larger screen, more bubbles.
    } else if (screenWidth >= 992) {
      noOfBubbles = 75; // Laptop
    } else if (screenWidth >= 768) {
      noOfBubbles = 50; // iPad
    } else {
      noOfBubbles = 25; // Mobile: smaller screen, fewer bubbles.
    }
  }

  /**
   * @function createBubble
   * @description Creates a bubble container with a randomized position.
   * @returns {HTMLElement} The container for a bubble and related CSS styling.
   *   This container is then appended to the `.bubbles` element to display the effect on screen.
   */
  function createBubble() {
    // This function creates a single bubble container and positions it randomly.
    const circleContainer = document.createElement("div"); // Create a div element for the bubble container.
    circleContainer.classList.add("circle_container"); // Add the `circle_container` class for styling.

    const startX = Math.random() * 100; // Generate a random horizontal starting position (0-100vw).
    const startY = Math.random() * 100; // Generate a random vertical starting position (0-100vh).
    circleContainer.style.transform = `translate(${startX}vw, ${startY}vh)`; // Set the initial position.

    const circle = createCircle(); // Create the inner bubble element.
    circleContainer.appendChild(circle); // Add the bubble to the container.

    return circleContainer; // Return the bubble container element.
  }

  /**
   * @function createCircle
   * @description Creates a bubble with random size and animation delay.
   * @returns {HTMLElement} The div element to create a circle element.
   *   The circle has a `circle` class for additional CSS styling.
   */
  function createCircle() {
    // This function creates a single bubble element with random size and animation delay.
    const circle = document.createElement("div"); // Create a div element for the bubble.
    circle.classList.add("circle"); // Add the `circle` class for styling.

    circle.style.animationDelay = Math.random() * bubbleLifeTime + "s"; // Set a random animation delay.
    const size = 5 + Math.floor(Math.random() * 10) + "px"; // Set a random size between 5px and 15px.
    circle.style.width = size; // Set the width of the bubble.
    circle.style.height = size; // Set the height of the bubble.

    return circle; // Return the bubble element.
  }

  /**
   * @function clearBubbles
   * @description Clears all existing bubbles from the wrapper element.
   *   This ensures that the bubble animation can be restarted cleanly.
   */
  function clearBubbles() {
    // This function removes all existing bubble elements from the container.
    while (wrapper.firstChild) {
      // Loop until there are no more child elements.
      wrapper.removeChild(wrapper.firstChild); // Remove the first child element.
    }
  }

  /**
   * @function updateBubbleStyles
   * @description Updates the bubble styles based on background brightness.
   *  This adjusts the bubble color to maintain visibility against the background.
   */
  function updateBubbleStyles() {
    // This function updates the bubble styles based on the background brightness.
    const backgroundBrightness = getBackgroundBrightness(); // Get the current background brightness.
    applyBubbleGradient(backgroundBrightness); // Apply a gradient to the bubbles based on the brightness.
  }

  /**
   * @function getBackgroundBrightness
   * @description Extracts and calculates the brightness level from the background gradient.
   * @returns {number} Average brightness level.
   *    This average helps determine the best bubble color for contrast.
   */
  function getBackgroundBrightness() {
    // This function calculates the average brightness of the background gradient.
    const heroSection = document.querySelector(".hero"); // Select the hero section element.
    const computedStyle = window.getComputedStyle(heroSection); // Get the computed style of the hero section.
    const backgroundImage = computedStyle.backgroundImage; // Get the background image style.

    if (!backgroundImage.includes("linear-gradient")) return 255; // Default brightness (white) if no gradient.

    const gradientColors = backgroundImage.match(/rgb\((\d+), (\d+), (\d+)\)/g); // Extract RGB color values from the gradient.

    if (!gradientColors) return 255; // Default brightness if no colors found.

    let totalBrightness = 0; // Initialize the total brightness.

    gradientColors.forEach((color) => {
      // Loop through each color in the gradient.
      const rgb = color.match(/\d+/g); // Extract the individual RGB values.
      if (rgb) {
        const brightness =
          (parseInt(rgb[0]) + parseInt(rgb[1]) + parseInt(rgb[2])) / 3; // Calculate the brightness of the color.
        totalBrightness += brightness; // Add the brightness to the total.
      }
    });

    return totalBrightness / gradientColors.length; // Calculate the average brightness.
  }

  /**
   * @function applyBubbleGradient
   * @description Applies a gradient color to bubbles based on background brightness.
   * @param {number} brightness - Background brightness level.
   *  If the background is bright, it applies a darker gradient; otherwise, it applies a lighter gradient.
   */
  function applyBubbleGradient(brightness) {
    // This function applies a gradient color to the bubbles based on the background brightness.
    const bubbles = document.querySelectorAll(".circle"); // Select all bubble elements.
    const newBubbleGradient =
      brightness > 150
        ? "linear-gradient(45deg, #2980b9, #6dd5fa, #1f3d58)" // Darker gradient for brighter backgrounds
        : "linear-gradient(45deg, #ffffff, #b0c7e8, #ffffff)"; // Lighter gradient for darker backgrounds

    bubbles.forEach((bubble) => {
      // Loop through each bubble and apply the new gradient.
      bubble.style.background = newBubbleGradient; // Set the background gradient of the bubble.
    });
  }

  // Periodically check and update bubble styles based on background changes
  setInterval(updateBubbleStyles, 1000); // Update the bubble styles every 1 second.

  /**
   * Event Listener: Reinitialize bubbles on window resize.
   *  This ensures the bubbles are redrawn correctly when the window size changes,
   *  keeping the animation responsive.
   */
  window.addEventListener("resize", init); // Reinitialize the bubbles when the window is resized.

  // ==========================================================================
  //  Loading Screen and Content Animation
  // ==========================================================================
  /**
   * @description Sets up and manages the loading animation and subsequent reveal
   * of the hero content.
   *   This improves the perceived performance of the website by showing a loading screen
   *   while the content is being loaded.
   */
  document.body.classList.add("loading"); // Apply class for initial styles: this class is used to set initial styles for the loading state.

  const loadingText = document.querySelector(".home-loading-text .dots"); // Select the loading text element.
  let dotCount = 0; // Initialize the dot counter.

  setInterval(() => {
    // Animate the loading dots.
    dotCount = (dotCount + 1) % 4; // Increment the dot count, looping from 0 to 3.
    loadingText.textContent = ".".repeat(dotCount); // Update the text content with the appropriate number of dots.
  }, 400); // Update every 400 milliseconds.

  // Fade Out Loader Function: this function hides the loading screen and reveals the hero section.
  const loaderBackground = document.querySelector(".home-loading-container"); // Select the loading container element.
  const heroSection = document.querySelector(".hero"); // Select the hero section element.

  /**
   * Event Listener: DOMContentLoaded
   * @description Sets up the fading and loading animation when website is ready and accessible
   */
  window.addEventListener("load", function () {
    // This event listener ensures that the loading screen is hidden and the hero section is revealed
    // only after all resources (images, scripts, etc.) have been fully loaded.
    setTimeout(() => {
      //Ensure all elements have been loaded before timeout function occurs

      loaderBackground.classList.add("fade-out"); // Add fade-out class: this class triggers the fade-out animation.
      loaderBackground.addEventListener("transitionend", () => {
        // After fade-out, hide the loader completely

        loaderBackground.style.display = "none"; // Hide after transition: after the fade-out animation completes, hide the loading container.

        heroSection.classList.add("visible"); // Add the visible class to show the hero section
        // heroSection.style.display = "flex";
      });
    }, 5000); // Changed timeout for the effects: Delay the animation to allow for the content to load.
  });

  // Select elements
  const image = document.querySelector(".slide_in_from_top"); // Select the image element that slides in from the top.
  const buttons = document.querySelectorAll(".fade_in"); // Select the buttons that fade in.
  const hiddenSlideElements = document.querySelectorAll(".hidden_slide_in"); //select all elements with hidden_slide_in

  // Wait a bit before triggering animations
  setTimeout(() => {
    // Add the class that triggers slide-in animation for the image
    if (image) {
      // If the image element exists
      image.classList.add("visible"); // Add the "visible" class to start the slide-in animation
    }
  }, 5500); // Delay of 5500 ms (5.5 seconds) before starting the animation.

  // Wait a bit before triggering animations
  setTimeout(() => {
    hiddenSlideElements.forEach((element) => {
      // Iterate through each element with the "hidden_slide_in" class

      element.classList.add("visible"); // Add the class that triggers animations
    });
  }, 6500); // Delay of 6500 ms (6.5 seconds) before starting the animations.

  // Add the class that triggers bounce-in animation for buttons
  setTimeout(() => {
    // After a delay, start the button animations and remove the loading class.
    buttons.forEach((button) => {
      // Iterate through each button element.
      button.classList.add("visible"); // Add the "visible" class to start the fade-in animation
    });

    document.body.classList.remove("loading"); // Remove the "loading" class from the body to allow the page to display normally.
  }, 9500); // Delay of 9500 ms (9.5 seconds) before starting the animations.

  // ==========================================================================
  //  Footer Effects
  // ==========================================================================
  /**
   * Adds a "peeking" animation to the footer when it enters the viewport.
   *   This effect makes the footer slide up and down slightly when it first becomes visible.
   */

  let hasPeeked = false; // Check if the page has peeked before: this flag prevents the animation from running multiple times.
  const footer = document.querySelector(".footer"); // Select the footer element.

  // Event Listener: "scroll"
  window.addEventListener("scroll", function () {
    // Attach an event listener to the window's "scroll" event.
    /**
     * Function that runs for the page to know it should peek
     * Or if it already ran and it's currently view
     *
     */
    function isFooterOutsideView() {
      // This function checks whether the footer is completely outside the viewport.
      const footerRect = footer.getBoundingClientRect(); // Get the bounding rectangle of the footer element.
      // All these 4 have to be present for the element not to be rendered.

      return (
        footerRect.top < 0 || // top of footer is above the viewport
        footerRect.left < 0 || // left of footer is to the left of the viewport
        footerRect.right >
          (window.innerWidth || document.documentElement.clientWidth) || // right of footer is to the right of the viewport
        footerRect.bottom >
          (window.innerHeight || document.documentElement.clientHeight) // bottom of footer is below the viewport
      );
    }

    // If all these four checks are true, set to visibility so that it is seen only when all four corners have been met.
    // Conditions for action on the site
    if (
      !hasPeeked && // hasPeeked should check before other parameters so that it only starts on not viewed only.
      window.getComputedStyle(footer).display !== "none" && // If the footer is not set to "none": ensure the footer is not hidden.
      isFooterOutsideView() // Check visibility: check if the footer is outside the viewport.
    ) {
      footer.classList.add("activate_peek"); // trigger it: add the "activate_peek" class to start the animation.

      // Timeout to prevent errors: use a timeout to remove the class after the animation completes.
      setTimeout(function () {
        // Turn off those elements
        footer.classList.remove("activate_peek"); // Remove the "activate_peek" class to stop the animation.
        hasPeeked = true; // Set the "hasPeeked" flag to true to prevent the animation from running again.
      }, 800); // The timeout duration matches the animation duration to reset after it has run.
    }
  });
});

// ==========================================================================
//  Functions (Helper functions - keep all functions for the code below here)
// ==========================================================================

/**
 * @function preventButtonAbuse
 * @description Disables all buttons with the class '.btn' after they are clicked.
 * This prevents users from repeatedly clicking buttons.
 */
function preventButtonAbuse() {
  // This function disables all buttons with the class "btn" after they are clicked, preventing multiple submissions.
  document.querySelectorAll(".btn").forEach((button) => {
    // Loop through each button element with the class "btn".
    button.addEventListener("click", function () {
      // Attach an event listener to the button's "click" event.
      this.disabled = true; // Disable the button after it is clicked.
    });
  });
}
