/**
 * @file project_detail.js
 * @description This file contains JavaScript code specific to the project detail page.
 * It primarily manages the animation triggers for various elements to be displayed when the page loads.
 */

document.addEventListener("DOMContentLoaded", function () {
  // This event listener ensures that the code executes only after the
  // entire HTML document has been fully loaded and parsed.

  // ==========================================================================
  //  Element Selection
  // ==========================================================================

  // Selects various elements on the page for manipulation and animation.
  const portfolioProjectHeader = document.querySelector("h2.fade_in"); // The main header for the project page.
  // const portfolioProjectMedia = document.querySelector(  // commented query
  //   "div.hidden_slide_in.slideInFromRight"
  // );
  const projectPlaceholder = document.querySelectorAll(
    "div.project-placeholder.fade_in"
  ); // Selects all loading placeholder divs, these are usually CSS load effects
  const portfolioProject = document.querySelectorAll(
    "div.project-listing.fade_in"
  ); // Selects all actual project listing divs

  const footerSection = document.querySelector(".footer"); // Selects the footer section,

  // ==========================================================================
  //  Animation Triggers
  // ==========================================================================

  /**
   * @description sets timeouts to trigger CSS animations and transitions on the page elements.
   * The timeouts are staggered to create a cascading effect, enhancing the visual appeal.
   */

  setTimeout(() => {
    // After 6.25 seconds, make the project header appear by adding the "visible" class.
    portfolioProjectHeader.classList.add("visible");
  }, 6250);

  setTimeout(() => {
    // Show the Loading Screen 1 with CSS effects.
    projectPlaceholder.forEach((projectPlaceholderDetail) => {
      projectPlaceholderDetail.style.display = "block";
      projectPlaceholderDetail.classList.add("visible");
    });
  }, 6250);

  setTimeout(() => {
    // This line will allow the actual project data to show
    projectPlaceholder.forEach((projectPlaceholderDetail) => {
      projectPlaceholderDetail.classList.add("fade_out");
      projectPlaceholderDetail.classList.remove("visible");
      projectPlaceholderDetail.remove();
    });

    portfolioProject.forEach((portfolioProjectDetail) => {
      portfolioProjectDetail.style.display = "block";
      portfolioProjectDetail.classList.add("visible");
    });
  }, 9250);

  setTimeout(() => {
    // After 8.75 seconds, make the footer appear by adding the "visible" class.
    footerSection.classList.add("visible");
  }, 7000);
});
