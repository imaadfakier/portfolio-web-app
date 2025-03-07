/**
 * @file navbar.js
 * @description This file contains JavaScript code that manages the circular navigation bar's
 *  open and close functionality. It's a self-executing function that encapsulates all logic
 * to prevent namespace pollution and ensures that the navigation bar is interactive.
 */

document.addEventListener("DOMContentLoaded", function () {
  // This event listener ensures that the code executes only after the
  // entire HTML document has been fully loaded and parsed.

  /**
   * @function
   * @description Immediately invoked function expression (IIFE) to encapsulate navbar functionality.
   * - Prevents global scope pollution by creating a private scope.
   * - Adds/Removes classes to show/hide elements, controlling the visibility of the navigation bar.
   * - Manages open and close states of navigation bar, toggling the navigation menu's visibility.
   */
  (function () {
    // This is an Immediately Invoked Function Expression (IIFE), which creates a private scope to prevent variable naming conflicts.
    // ==========================================================================
    //  Element Selection
    // ==========================================================================

    // Selects the HTML elements that the script will manipulate.
    const button = document.getElementById("cn-button"); // The button that toggles the navigation menu.
    const wrapper = document.getElementById("cn-wrapper"); // The wrapper element that contains the navigation menu.
    const overlay = document.getElementById("cn-overlay"); // The overlay that covers the screen when the menu is open.

    // ==========================================================================
    //  Event Handlers
    // ==========================================================================

    // Sets up event listeners to handle user interactions with the navigation bar.
    let open = false; // State to keep track of whether navbar is open or not: This variable stores whether the navigation menu is currently open or closed.

    // Event listener to open/close menu when the button is clicked
    button.addEventListener("click", handler, false); // Add listener to the "click" event

    // Event listener to prevent clicks inside the wrapper from closing the nav
    wrapper.addEventListener("click", cnhandle, false); // Added Listener to stop clicks bubbling up.

    // Event listener to close the nav when clicking the overlay
    overlay.addEventListener("click", closeNav, false); // Calls closeNav to hide all.

    // ==========================================================================
    //  Functionality
    // ==========================================================================

    /**
     * @function cnhandle
     * @description Prevents event propogation, to make the function more smooth.
     * @param {event} e - Event, the click event.
     */
    function cnhandle(e) {
      // This function prevents an event from propagating up the DOM tree, which can cause unexpected behavior.
      e.stopPropagation(); // Prevent event from bubbling up to document, to prevent it from auto closing.
    }

    /**
     * @function handler
     * @description Handles button click events to open or close the navigation.
     * @param {Event} e - The click event.
     *  This function toggles the navigation menu's visibility and updates the button text.
     */
    function handler(e) {
      // This function is called when the navigation button is clicked.
      if (!e) var e = window.event; // Sets the event type to window.event
      e.stopPropagation(); // Prevent event from reaching the document,

      // Toggle navigation
      if (!open) {
        // if the menu is not open, open it
        openNav(); // Open nav
      } else {
        // if the menu is open, close it
        closeNav(); // Close Nav
      }
    }

    /**
     * @function openNav
     * @description Opens the navigation menu.
     *   This function adds CSS classes to display the navigation menu and change the button text.
     */
    function openNav() {
      // This function opens the navigation menu.
      open = true; // Set state to open: the navigation menu is now open
      button.innerHTML = "-"; // Change button content:  change button text to minus (-)

      overlay.classList.add("on-overlay"); // Add overlay class: Add overlay class to show the overlay.
      wrapper.classList.add("opened-nav"); // Add opened-nav class: Add opened-nav class to the main html to the user
    }

    /**
     * @function closeNav
     * @description Closes the navigation menu.
     *  This function removes CSS classes to hide the navigation menu and reset the button text.
     */
    function closeNav() {
      // This function closes the navigation menu.
      open = false; // Set state to closed: The navigation menu is now closed
      button.innerHTML = "+"; // Change button content: Change button text to plus (+)
      overlay.classList.remove("on-overlay"); // Remove overlay class: Remove overlay class
      wrapper.classList.remove("opened-nav"); // Remove opened-nav class: Remove open nav class
    }

    // ==========================================================================
    //  Global Event Listener - closes on any document click
    // ==========================================================================
    /**
     * @description  Automatically closes the navigation when clicking outside
     * the nav bar.
     *  This event listener ensures that the navigation menu is closed when the user clicks anywhere outside of it.
     */
    document.addEventListener("click", closeNav);
    // Add "click" listenter and runs the closeNav function.
  })();
});
