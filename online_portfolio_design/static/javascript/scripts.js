/**
 * @file scripts.js
 * @description This file contains general JavaScript functions that are applied
 * to multiple pages across the website. It handles tasks such as:
 *   - Ensuring the page starts at the top on reload and navigation.
 *   - Implementing bubble animations with configurable size and colors.
 *   - Managing a loading screen with text-based progress.
 *   - Preventing button abuse by disabling buttons after a click.
 *   - Loading and executing Google reCAPTCHA for form submissions.
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

document.addEventListener("DOMContentLoaded", function () {
  // This event listener ensures that the following code executes only after the
  // entire HTML document has been fully loaded and parsed.

  const validPages = ["about", "career", "projects", "contact"]; // All of the pages of interest on the whole document

  Promise.all(
    validPages.map(async (currentPage) => {
      return {
        currentPage,
        isValid: await isPage(currentPage), // Await the result of isPage
      };
    })
  ).then((results) => {
    // Wrap the handlePageLogic call within the then block
    handlePageLogic(results); // then give for handling
  });

  function handlePageLogic(results) {
    // Handle logic for each page if isValid or not

    const isValidPage = results.some((result) => result.isValid);
    // check results if valid page or not

    if (!isPage("") && isValidPage) {
      // If a valid page is not home.
      executeBubbleAnimation();
      // Perform this action
      executeLoadingScreen();
      // and this action
    } else if (!isPage("")) {
      // If the page isnt home, apply the following
      const navbar = document.querySelector(".nav-container");
      navbar.classList.add("visible");
      navbar.classList.remove("fade_in");
    }
  }

  function executeBubbleAnimation() {
    // ==========================================================================
    //  Bubble Animation
    // ==========================================================================
    /**
     * @description Generates a bubble animation with randomized sizes and positions.
     * Adjusts total bubbles on screen based on browser window/viewport size and
     * bubble colors based on background brightness. Reinitializes bubbles on window resize.
     *   This function is responsible for creating and managing the dynamic bubble animation on the page.
     */

    /** Configuration Variables **/
    const bubbleLifeTime = 20; // Animation duration in seconds: how long each bubble takes to float across the screen.
    let noOfBubbles = 20; // Initial number of bubbles to generate: this value is adjusted based on the screen size in the setBubbleCount function.

    const wrapper = document.querySelector(".bubbles");
    // select the  bubbles wrapper

    if (!wrapper) {
      // if wrapper cannot be selected
      return; // exit the function to prevent issues
    }

    let bubbles = []; // Stores bubble elements for updating: this array will hold references to the created bubble elements.

    // Initialize the bubble effect
    init(); // run the init function to set everything in motion

    /**
     * @function init
     * @description Initializes the bubble effect by clearing old bubbles, setting the bubble count,
     * generating new ones, and updating bubble styles.
     */
    function init() {
      // This function sets the init code to make the effect work
      clearBubbles();
      // run function to clear bubbles
      setBubbleCount();
      // set the amount of bubbles as appropriate
      bubbles = [];

      for (let i = 0; i < noOfBubbles; i++) {
        // run this function to generate all new bubbles
        const bubble = createBubble();
        // creates the bubble elements
        wrapper.appendChild(bubble);
        // adds the element in the wrapper
        bubbles.push(bubble);
        // gives it the styling from "bubbles"
      }

      updateBubbleStyles();
      // update the styles
    }

    /**
     * @function setBubbleCount
     * @description Sets the number of bubbles based on the screen width.
     */
    function setBubbleCount() {
      // Sets the BubbleCount for all screen sizes

      const screenWidth = window.innerWidth;
      // find the width of all screens sizes

      if (screenWidth >= 1200) {
        // if DESKTOP size, do
        noOfBubbles = 100; // Desktop
      } else if (screenWidth >= 992) {
        // if LAPTOP size, do
        noOfBubbles = 75; // Laptop
      } else if (screenWidth >= 768) {
        // if IPAD size, do
        noOfBubbles = 50; // iPad
      } else {
        // if MOBILE size, do
        noOfBubbles = 25; // Mobile
      }
    }

    /**
     * @function createBubble
     * @description Creates a bubble container with a randomized position.
     * @returns {HTMLElement} circleContainer - The container for a bubble and related CSS styling
     */
    function createBubble() {
      // This function creates the styling for the bubble for the page

      const circleContainer = document.createElement("div");
      // adds the element to the html code
      circleContainer.classList.add("circle_container");
      // adds the ".circle_container" to the html div

      const startX = Math.random() * 100;
      // math to make the bubble generate in any random  position
      const startY = -10; // Start above the viewport
      // math to make it start off the page,

      circleContainer.style.transform = `translate(${startX}vw, ${startY}vh)`;
      // the translate with the randoms variables to give the location.

      const circle = createCircle();
      // this line of code, calls the create circle function to make the bubble
      circleContainer.appendChild(circle);
      // then adds it to the const circleContainer variable to peform styling

      return circleContainer;
      // give it back
    }

    /**
     * @function createCircle
     * @description Creates a bubble with random size and animation delay.
     * @returns {HTMLElement} circle - the circle element
     */
    function createCircle() {
      // this function creates the inner bubble itself with the styling and html

      const circle = document.createElement("div");
      // create the circle and add it to the html
      circle.classList.add("circle");
      // create the  ".circle" to the html element

      circle.style.animationDelay = Math.random() * bubbleLifeTime + "s";
      // random math to prevent the exact same outcome.
      const size = 5 + Math.floor(Math.random() * 10) + "px"; // Set a random size between 5px and 15px
      // math to get the bubbles from 5px to 15px with flooring

      circle.style.width = size;
      // apply width
      circle.style.height = size;
      // apply height

      return circle;
      // give it all back
    }

    /**
     * @function clearBubbles
     * @description Clears all existing bubbles from the wrapper element.
     */
    function clearBubbles() {
      // This funciton clears the bubbles for a fresh regenration
      while (wrapper.firstChild) {
        // while there is a bubble active on the screen, preform code
        wrapper.removeChild(wrapper.firstChild);
        // then remove the html code to remove the bubble from the screen.
      }
    }

    /**
     * @function updateBubbleStyles
     * @description Updates the bubble styles based on background brightness.
     */
    function updateBubbleStyles() {
      // This function styles the bubbles based on brightness
      const backgroundBrightness = getBackgroundBrightness();
      // variable to see background lightness
      applyBubbleGradient(backgroundBrightness);
      // then call for it to be applied
    }

    /**
     * @function getBackgroundBrightness
     * @description Extracts and calculates the brightness level from the background gradient of the
     * relevant CSS styling for the given page/section.
     * @returns {number} Average brightness level
     */
    function getBackgroundBrightness() {
      // This funtion finds the background to find what bubble type would be best

      let selector;
      // setting let variable

      if (document.getElementById("about")) {
        // if ABOUT element
        selector = "#about";
      } else if (document.getElementById("career")) {
        // if CAREER element
        selector = "#career";
      } else if (document.getElementById("projects")) {
        // if PROJECTS element
        selector = "#projects";
      } else if (document.getElementById("project-detail")) {
        // if PROJECT DETAIL element
        selector = "#project-detail";
      } else if (document.getElementById("contact")) {
        // if CONTACT element
        selector = "#contact";
      } else {
        // if not a element of the previous elements set default
        selector = null; // Or a default selector if none match
      }

      const relevantSection = selector
        ? document.querySelector(selector)
        : null;
      // This is done to get that page in question.

      const computedStyle = window.getComputedStyle(relevantSection);
      // now get the Style
      const backgroundImage = computedStyle.backgroundImage;
      // Then get the BackgroundImage

      if (!backgroundImage.includes("linear-gradient")) return 255; // Default brightness
      // check the BackgroundImage
      // return light if there is no image.

      const gradientColors = backgroundImage.match(
        /rgb\((\d+), (\d+), (\d+)\)/g
      );
      // regex check to extract the colours from the background

      if (!gradientColors) return 255;
      // If the colours can not be extracted, give the default back.

      let totalBrightness = 0;
      // starting total

      gradientColors.forEach((color) => {
        // check each colour that is active on the background page
        const rgb = color.match(/\d+/g);
        // match the colours to extract
        if (rgb) {
          // if there colours
          const brightness =
            (parseInt(rgb[0]) + parseInt(rgb[1]) + parseInt(rgb[2])) / 3;
          // get the colours and add them
          totalBrightness += brightness;
          // set the value to the start value (totalbrightness)
        }
      });

      return totalBrightness / gradientColors.length;
      // then find a balance and give a brightness level.
    }

    /**
     * @function applyBubbleGradient
     * @description Applies a gradient color to bubbles based on background brightness.
     * @param {number} brightness - Background brightness level
     */
    function applyBubbleGradient(brightness) {
      // give value for dark/light bubbles

      const bubbles = document.querySelectorAll(".circle");
      // find all bubbles
      const newBubbleGradient =
        brightness > 150
          ? "linear-gradient(45deg, #2980b9, #6dd5fa, #1f3d58)"
          : "linear-gradient(45deg, #ffffff, #b0c7e8, #ffffff)";
      // check lightness and give back the value if the new style bubble is dark or light.

      bubbles.forEach((bubble) => {
        // if the bubble does exists, do
        bubble.style.background = newBubbleGradient;
        // style bubble
      });
    }

    // Periodically check and update bubble styles based on background changes
    setInterval(updateBubbleStyles, 1000);
    // preform action every 1000, which is 1 second

    // Reinitialize bubbles on window resize
    window.addEventListener("resize", init);
    // Re-init on resize of the page.
  }

  function executeLoadingScreen() {
    // ==========================================================================
    //  Loading Animation and Page Transitions
    // ==========================================================================
    /**
     * @description This code manages a loading animation and smoothly transitions the page elements.
     *  It increases a percentage counter displayed on the loading screen and fades out the loading screen when the
     * loading is complete (at 100%). It also handles delayed loading
     * of Google reCAPTCHA script based on current URL.
     */

    document.body.classList.add("loading");
    // add "loading" to the CSS

    const loadingText = document.querySelector(".loading-text");
    // find loading text in HTML
    const loaderBackground = document.querySelector(".loading-container");
    // find background of the loader
    const navbar = document.querySelector(".nav-container");
    // look for container where nav elements are

    navbar.classList.add("fade_in");
    // added CSS, class effect "fade_in"

    let load = 0;
    // stating a int which does not contain  a value.
    let interval = setInterval(() => {
      // for the action and functions within to repeat at a set intervel.
      load++;
      // add 1 to the load number

      if (load > 99) {
        // check if it's less or greater than 99 (as loading is in perentage)
        clearInterval(interval);
        // clear interval so it stops to prevent looping.
        fadeOutLoader();
        // then call function to fade and change
      }

      loadingText.innerText = `${load}%`;
      // update the txt with the text.
    }, 50);

    /**
     * @function fadeOutLoader
     * @description Initiates the fade-out process for the loading screen and sets up events
     * to trigger content appearance and further script loading upon completion of the
     * transition.
     */
    function fadeOutLoader() {
      // function called to fade out and perform additional changes
      setTimeout(() => {
        // set timer for all code in this code block to not trigger for X amount of time.
        loaderBackground.classList.add("fade-out"); // Add CSS transition

        loaderBackground.addEventListener("transitionend", () => {
          // Add even listner to the background once all content load it, then do the following action

          loaderBackground.style.display = "none"; // Hide after fade-out
          // after the background runs, it's set to none in display to prevent the users from seeing the code.
          document.body.classList.remove("loading");
          // and remove "loading" to the page which shows content.

          navbar.classList.add("visible");
          // then load the nav with the CSS visible code

          setTimeout(() => {
            // perform action for X miliseconds after

            navbar.classList.remove("fade_in");
            // remove fade in
          }, 1000);

          if (isPage("contact")) {
            // check for these pages
            loadReCaptchaScript();
            // if the conditions are valid, perform the action.
          }
        });
      }, 500);
    }
  }

  // ==========================================================================
  //  Button Abuse Prevention
  // ==========================================================================

  /**
   * @description Prevents abuse by disabling all buttons with the .btn class after they are clicked
   * This is performed on all pages unless it is the projects or contact page
   */
  if (!isPage("projects") && !isPage("contact")) {
    // set that on all pages UNLESS the 3 conditions are met

    preventButtonAbuse();
    // the do abuse prevention
  }
});

// ==========================================================================
//  Functions
// ==========================================================================

/**
 * @function loadReCaptcha
 * @description Loads the Google reCAPTCHA script and executes the reCAPTCHA logic.
 */
function loadReCaptcha() {
  // Call API and get token.

  grecaptcha.ready(function () {
    // If API ready do

    grecaptcha
      .execute(reCAPTCHASiteKey, {
        // If API runs to completion, then create the token
        action: "submit",
      })
      .then(function (token) {
        // give that token to the html
        document.getElementById("recaptchaToken").value = token;
      });
  });
}

/**
 * @function loadReCaptchaScript
 * @description Loads the Google reCAPTCHA script dynamically, then executes reCAPTCHA.
 */
function loadReCaptchaScript() {
  // Add API script for ReCaptcha
  let recaptchaScript = document.createElement("script");
  // create the element in the html document
  recaptchaScript.src =
    "https://www.google.com/recaptcha/api.js?render=".concat(reCAPTCHASiteKey);
  // get API
  recaptchaScript.async = true;
  // Asynchronus code
  recaptchaScript.defer = true;
  // defer code load

  recaptchaScript.onload = function () {
    // run function for loading on page
    loadReCaptcha(); // Now execute the reCAPTCHA logic
    // then load the ReCpatcha
  };

  document.body.appendChild(recaptchaScript);
  // all added to the body.
}

/**
 * @function preventButtonAbuse
 * @description Disables all buttons with the class '.btn' after they are clicked.
 * This prevents users from repeatedly clicking buttons.
 */
function preventButtonAbuse() {
  // Function to disable all buttons with the class of btn after a press.
  document.querySelectorAll(".btn").forEach((button) => {
    // find all buttons with the class ".btn"
    button.addEventListener("click", function () {
      // Add a listener to the button press
      this.disabled = true;
      // then diable the button
    });
  });
}

/**
 * @function isPage
 * @description Checks if the current page's pathname matches the given page name,
 * or if it's a valid project route.
 * @param {string} pageName - The name of the page to check against.
 * @returns {boolean} True if the pathname matches the page name or is a valid project route, false otherwise.
 */
function isPage(pageName) {
  // This function checks to confirm which page the user is on.
  if (pageName == "projects") {
    // Check if the page is project
    return isValidProjectRoute(window.location.pathname);
    // True or False
  } else {
    // Check if a a non project page
    return window.location.pathname == "/" + pageName;
    // return as true or false
  }
}

/**
 * @function isValidProjectRoute
 * @description Checks if the given path is a valid project route.
 * @param {string} path - The pathname to check.
 * @returns {Promise<boolean>} A Promise that resolves to true if the path is a valid project route, false otherwise.
 */
function isValidProjectRoute(path) {
  return new Promise((resolve, reject) => {
    // Regex for /projects or /projects/page/N (where N is a number)
    const pageMatch = path.match(/^\/projects(?:\/page\/(\d+))?$/);

    if (pageMatch) {
      // If it's /projects or /projects/page/N, validate the page number
      const pageNumber = pageMatch[1];

      // **CRITICAL CHANGE: No short-circuiting!**
      if (pageNumber === undefined) {
        //If pageNumber is undefined, then it's valid.
        resolve(true);
      } else {
        // Asynchronously check if the page is valid
        isValidProjectPage(pageNumber)
          .then((isValid) => {
            if (isValid) {
              resolve(true); // Resolve if the page is valid
            } else {
              resolve(false); // Resolve with false, the page is invalid
            }
          })
          .catch((error) => {
            reject(error); // Reject if there's an error during validation
          });
      }

      return; // crucial: exit this code path
    }

    // Regex for /projects/ID (where ID is a number)
    const idMatch = path.match(/^\/projects\/(\d+)$/);

    if (idMatch) {
      // If it's /projects/ID, validate the project ID
      const projectId = idMatch[1];

      // Asynchronously validate the project ID
      isValidProjectId(projectId)
        .then((isValid) => {
          if (isValid) {
            resolve(true); // Resolve if the project ID is valid
          } else {
            resolve(false); // Resolve with false, the project ID is invalid
          }
        })
        .catch((error) => {
          reject(error); // Reject if there's an error during validation
        });
      return; // Crucial: exit this code path
    }

    resolve(false); // Not a valid project route
  });
}

/**
 * @function isValidProjectPage
 * @description Checks if the given page number is a valid project page.
 * @param {string} pageNumber - The page number to check.
 * @returns {boolean} True if the page number is valid, false otherwise.
 */
function isValidProjectPage(pageNumber) {
  // This function tests and checks the the pages on the project route.
  const pageNum = parseInt(pageNumber, 10);
  // convert to the data
  if (isNaN(pageNum) || pageNum <= 0) {
    // check for errors with the pageNumber
    return false;
    // Then not a valid request.
  }

  // Make an asynchronous request to fetch total_projects from backend and then use it to compare the page number
  return (
    fetch("/projects/api")
      // try get the json file from that URL
      .then((response) => {
        // if the response works
        if (!response.ok) {
          // check is its not okay, then send error to the console
          throw new Error(`HTTP error! Status: ${response.status}`);
          // send the error
        }
        return response.json(); // Parse the response body as JSON
        // or continue on if that works
      })
      .then((data) => {
        // when response is sent back

        //   let total_projects = data.total_projects;
        let total_projects = data.length;
        // let total projects to data length
        //   let PROJECTS_PER_PAGE = data.projects_per_page;
        let PROJECTS_PER_PAGE = 12;
        // projects = 12

        let maxPage =
          (parseInt(total_projects, 10) + parseInt(PROJECTS_PER_PAGE, 10) - 1) /
          parseInt(PROJECTS_PER_PAGE, 10);
        // math to find max pages
        if (pageNum > maxPage) return false;
        // if num is over the max, then give error
        return pageNum <= maxPage;
        // otherwise its ok
      })
      .catch((error) => {
        // catch block in the event of an error
        return false; // Default to false
        // then not ok
      })
  );
}

/**
 * @function isValidProjectId
 * @description Checks if the given project ID is a valid project ID by querying the database asynchronously via an AJAX request.
 * @param {string} projectId - The project ID to check.
 * @returns {boolean} True if the project ID is valid, false otherwise.
 */
function isValidProjectId(projectId) {
  // This function helps to determine if the project ID is valid
  const project_id = parseInt(projectId, 10);
  // if it is, then it will be int
  if (isNaN(project_id) || project_id <= 0) {
    // if error
    return false;
    // not a valid project
  }

  // Make an asynchronous request to fetch total_projects from backend and then use it to compare the page number
  return (
    fetch("/projects/api/" + project_id)
      // try get the json file from that URL and if it is a project.
      .then((response) => {
        // if the resonse back is a project, and all is oke then
        if (!response.ok) {
          // if its not ok, then send error to the console
          throw new Error(`HTTP error! Status: ${response.status}`);
          // write a new erorr
        }
        return true; // Successful Response
        //  then this project exist
      })
      .catch((error) => {
        // handle exception
        return false; // Default to false
        // then the project cannot be found
      })
  );
}
