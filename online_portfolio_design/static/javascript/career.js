/**
 * @file career.js
 * @description This file contains JavaScript code specific to the career page.
 * It primarily manages the animation trigger for various elements to be displayed when the page loads.
 */

jQuery(function ($) {
  // This is a self-executing anonymous function, providing scope to the code and a passed jQuery library

  // ==========================================================================
  //  Animation Trigger
  // ==========================================================================

  /**
   * @function doAnimations
   * @description Animates sections based on their visibility in the viewport.
   */
  var doAnimations = function () {
    // All animations in the document.

    /**
     * @function isInViewport
     * @description Checks if an element is in the viewport.
     * @param {jQuery} element - The jQuery element to check.
     * @returns {boolean} True if the element is in the viewport, false otherwise.
     */
    function isInViewport(element) {
      // This tests to determine that the element is active and able to be viewed
      if (!element.length) return false;
      // if there are no elements on that specific section, return false.

      var scrollTop = $(window).scrollTop();
      // The Distance it scrolled to
      var windowHeight = $(window).height();
      // The hight of the Browser

      var elementTop = element.offset().top;
      // the distance between the scrolling window and the element on the page.
      var elementBottom = elementTop + element.outerHeight();
      // To test is the elment has height

      return (
        elementTop <= scrollTop + windowHeight && elementBottom >= scrollTop
      );
      // Returns all these statements in a bool value, if all is correct it returns a boolean and code continues.
    }

    /**
     * @function isOutOfViewport
     * @description Checks if an element is completely out of the viewport.
     * @param {jQuery} element - The jQuery element to check.
     * @returns {boolean} True if the element is out of the viewport, false otherwise.
     */
    function isOutOfViewport(element) {
      // Testing if the elements are out of site
      if (!element.length) return false;
      // If the element doesnt exsist return as false

      var scrollTop = $(window).scrollTop();
      // Variable for Scrolling Value
      var windowHeight = $(window).height();
      // Variable for Window Hight Value

      var elementTop = element.offset().top;
      // How the element related to the top
      var elementBottom = elementTop + element.outerHeight();
      // adding in that element

      return elementBottom < scrollTop || elementTop > scrollTop + windowHeight;
      // Return if its on the page or nah
    }

    /**
     * @function animateSection
     * @description Adds and removes animation classes based on whether a section is in or out of the viewport.
     * @param {jQuery} section - The jQuery section element to animate.
     * @param {string} animationIn - The animation class to add when the section is in the viewport.
     * @param {string} animationOut - The animation class to add when the section is out of the viewport.
     */
    function animateSection(section, animationIn, animationOut) {
      // preforms the Animmation

      if (!section.length) return;
      // check for the elements, false

      if (isInViewport(section) && !section.hasClass("animated")) {
        // if it is in the view then check if there is class active
        section.addClass("animated " + animationIn);
        // add a class for animation
      } else if (isOutOfViewport(section) && section.hasClass("animated")) {
        // check code for out, and check for the animated section
        section.removeClass(animationIn).addClass(animationOut);
        // remove code, and add code

        // Reset animation once it's done to allow re-triggering
        setTimeout(() => {
          // Timer
          section.removeClass("animated " + animationOut);
          // Remove from the page
        }, 1000); // Adjust time to match CSS animation duration,  1000 ( 1 sec )
      }
    }

    /**
     * @function animateFooter
     * @description Adds a "visible" class to the footer when it is in the viewport.
     * @param {jQuery} footer - The jQuery footer element to animate.
     */
    function animateFooter(footer) {
      // this code performs the animation

      if (!footer.length) return;
      //check all

      if (isInViewport(footer) && footer.hasClass("fade_in")) {
        // check
        footer.addClass("visible");
        // add class
      }
      // No "out of view" logic for the footer - it stays visible
    }

    // Run animations
    animateSection($("#experience"), "bounceInRight", "bounceOutRight");
    // Peform to EXperice section
    animateSection($("#education"), "bounceInLeft", "bounceOutLeft");
    // Peform to EDU section
    animateSection($("#certifications"), "fadeIn", "fadeOut");
    // Preform to CERT section
    animateFooter($(".footer")); // Ensure footer logic is included
    // run the footer code
  };

  /**
   * @function startAnimations
   * @description Begins the animations once the body has loaded.
   */
  function startAnimations() {
    // This code starts the function once the user is not loading.
    if (!$("body").hasClass("loading")) {
      // check to test if the page is loading
      $("section#career").animate({ opacity: 1 }, 500);
      // make the section fade in
      $(window).on("scroll", doAnimations);
      // on scroll perform animations
      $(window).trigger("scroll");
      // trigger it here
    } else {
      // or else do
      setTimeout(startAnimations, 25);
      // set to 25ms for the loading state
    }
  }

  startAnimations();
  // then launch this code.
});
