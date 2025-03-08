/**
 * @file about.js
 * @description This file contains JavaScript code specific to the about page.
 * It manages animations, visibility transitions, and responsiveness of different
 * elements within the about section.
 */

document.addEventListener("DOMContentLoaded", function () {
  // This event listener ensures that the code executes only after the
  // entire HTML document has been fully loaded and parsed.

  // ==========================================================================
  //  Element Selection
  // ==========================================================================

  // Selects various elements on the page for manipulation and animation.
  const aboutSection = document.getElementById("about");
  const aboutMeHeader = document.querySelector("h2.hidden_slide_in"); // "About Me" header
  const aboutMeContent = document.querySelector("p.fade_in"); // "About Me" paragraph content
  const horizontalLine = document.querySelector("hr.hidden_slide_in"); // Horizontal line separator
  const technicalSkillsHeader = document.querySelector("h3.hidden_slide_in"); // "Technical Skills" header
  const skillCategories = document.querySelectorAll("h5.fade_in"); // Skill category headers
  const progressBars = document.querySelectorAll(".custom-progress"); // Progress bar elements
  const image = document.querySelector("img.hidden_slide_in"); // Image element
  const footerSection = document.querySelector(".footer"); // Footer section
  const skillDiv = document.querySelector(".col-lg-8.col-md-12.py-5"); // Skill div section for responsive

  // ==========================================================================
  //  Error Handling
  // ==========================================================================

  // Check if critical elements were found, and log a warning if any are missing.
  // This helps prevent errors if the HTML structure changes.
  if (
    !image ||
    !aboutMeHeader ||
    !aboutMeContent ||
    !horizontalLine ||
    !technicalSkillsHeader ||
    !footerSection ||
    !skillDiv
  ) {
    console.warn("One or more elements were not found."); // Log a warning to the console.
    return; // Prevent errors if critical elements are missing: exits the function to avoid further issues.
  } else {
    aboutSection.style.overflowX = "hidden";
  }

  // ==========================================================================
  //  Initial Setup
  // ==========================================================================

  // footerSection.style.display = "none"; // Hide the footer initially (commented out, so it's not currently doing anything)

  /**
   * @function addTextAlignClass
   * @description Applies 'text-center' class to the 'skillDiv' if the window width is less than 992 pixels,
   * otherwise removes the class.
   *   This function is used to ensure proper text alignment on different screen sizes.
   */
  function addTextAlignClass() {
    // Check if the window width is less than 992 pixels (typical breakpoint for medium-sized screens).
    if (window.innerWidth < 992) {
      skillDiv.classList.add("text-center"); // Add the 'text-center' class to center the text within the skill div.
    } else {
      skillDiv.classList.remove("text-center"); // Remove the 'text-center' class to allow default alignment.
    }
  }

  addTextAlignClass(); // Call on load: run the function when the page loads to set the initial text alignment.
  window.addEventListener("resize", addTextAlignClass); // and on resize: run the function whenever the window is resized to update the text alignment dynamically.

  // ==========================================================================
  //  Animation Sequences
  // ==========================================================================

  /**
   * @description Sets timeouts to trigger CSS animations and transitions on the page elements.
   * The timeouts are staggered to create a cascading effect, enhancing the visual appeal.
   *   The delays are carefully timed to create a visually appealing sequence of animations.
   */

  const baseAnimationDelay = 7000; // Initial wait Time: the base delay before any animations start.
  const skillCategoryAnimation = 14250; // Animation time for skill elements: the delay before skill categories and progress bars animate.
  const footerAnimation = 18750; // Footer transition time: the delay before the footer appears.

  setTimeout(() => {
    // After the base delay, add the 'visible' class to trigger the image's slide-in animation.
    image.classList.add("visible");
  }, baseAnimationDelay);

  setTimeout(() => {
    // After the base delay, add the 'visible' class to trigger the "About Me" header's slide-in animation.
    aboutMeHeader.classList.add("visible");
  }, baseAnimationDelay);

  setTimeout(() => {
    // After the base delay + 3 seconds, add the 'visible' class to trigger the "About Me" content's fade-in animation.
    aboutMeContent.classList.add("visible");
  }, baseAnimationDelay + 3000);

  setTimeout(() => {
    // After the base delay + 3.5 seconds, add the 'visible' class to trigger the horizontal line's slide-in animation.
    horizontalLine.classList.add("visible");
  }, baseAnimationDelay + 3500);

  setTimeout(() => {
    // After the base delay + 4.5 seconds, add the 'visible' class to trigger the "Technical Skills" header's slide-in animation.
    technicalSkillsHeader.classList.add("visible");
  }, baseAnimationDelay + 4500);

  setTimeout(() => {
    // After the skill category animation delay, add the 'visible' class to trigger the skill categories' fade-in animation.
    skillCategories.forEach((el) => el.classList.add("visible"));
    // Iterate through each skill category element and add the "visible" class.
    progressBars.forEach((el) => el.classList.add("visible"));
    // Iterate through each progress bar element and add the "visible" class.

    aboutSection.style.overflowX = "";
  }, skillCategoryAnimation);

  setTimeout(() => {
    // After the footer animation delay, add the 'visible' class to trigger the footer's appearance.
    // footerSection.style.display = "block";
    footerSection.classList.add("visible");
  }, footerAnimation);

  // ==========================================================================
  //  Progress Bar Animation
  // ==========================================================================

  /**
   * @description Manages the animation for the progress bars, setting initial styles,
   * then triggering the width animation and a shiny effect after a delay.
   *   This function is responsible for animating the progress bars to visually represent skill levels.
   */

  progressBars.forEach((progress) => {
    // Iterate through each progress bar element.
    const customProgressBar = progress.querySelector(".custom-progress-bar");
    // Select the inner progress bar element.
    const skillProgress = progress.dataset.skillProgress;
    // Get the skill progress value from the data attribute.

    // Reset progress bar styles to clear any previous state
    customProgressBar.style.setProperty("width", `0%`); // Set the initial width to 0%.
    customProgressBar.classList.remove("shiny-animation"); // Remove animation class: to reset shiny effect.
    customProgressBar.offsetHeight; // Force reflow to reset styles: this forces the browser to recalculate the styles and layout, ensuring that the transition starts from the initial state.

    customProgressBar.style.transition = "width 1.5s ease"; // Animate filling: set the transition property to animate the width change.

    setTimeout(() => {
      // After a delay, animate the progress bar to the specified width and add the shiny effect.
      customProgressBar.style.width = `${skillProgress}%`; // Set the width to the skill progress value.
      customProgressBar.classList.add("shiny-animation"); // Add shiny animation class to create the shiny effect.
    }, skillCategoryAnimation + 2750); // After elements and skill categories are in: to sync up
  });
});
