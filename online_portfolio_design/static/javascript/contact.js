/**
 * @file contact.js
 * @description This file contains JavaScript code specific to the contact page.
 * It manages the initial animations of page elements, performs form input validation,
 * and handles the submission of the contact form via AJAX, displaying success or error messages.
 */

document.addEventListener("DOMContentLoaded", function () {
  // This event listener ensures that the code executes only after the
  // entire HTML document has been fully loaded and parsed.

  // ==========================================================================
  //  Element Selection
  // ==========================================================================

  // Selects various elements on the page for manipulation and animation.
  const contactSection = document.getElementById("contact");
  const contactMeHeader = document.querySelector("h2.hidden_slide_in"); // "Contact" header
  const contactFormContainer = document.querySelector(".contact_form"); // The contact form container
  const submitButton = document.querySelector("button[type='submit']"); // The submit button
  const footerSection = document.querySelector(".footer"); // The footer section
  const nameField = document.getElementById("name"); // The name input field
  const emailField = document.getElementById("email"); // The email input field
  const messageField = document.getElementById("message"); // The message textarea field
  const blankContactForm = document.getElementById("contact-form"); // The main contact form

  // ==========================================================================
  //  Initial Styling
  // ==========================================================================

  document.body.style.overflow = "hidden";
  contactSection.style.overflowX = "hidden";
  // footerSection.style.display = "none"; // Hide the footer initially (commented out, so it's not currently doing anything)

  // ==========================================================================
  //  Animation and Loading
  // ==========================================================================

  /**
   * @description Sets up and manages the animation and transition effects for the components on this page.
   *   The timeouts are carefully timed to create a visually appealing sequence of animations.
   */

  setTimeout(() => {
    // After just over 6 seconds, make the contact header appear by adding the "visible" class.
    contactMeHeader.classList.add("visible");
  }, 6250);

  setTimeout(() => {
    // Make the contact form visible a bit after the header by adding the "visible" class.
    contactFormContainer.classList.add("visible");
  }, 8750);

  setTimeout(() => {
    // Show the submit button shortly after the form by adding the "visible" class.
    submitButton.classList.add("visible");

    contactSection.style.overflowX = "";
  }, 9250);

  setTimeout(() => {
    // Reveal the footer last by adding the "visible" class.
    // footerSection.style.display = "block";
    footerSection.classList.add("visible");

    document.body.style.overflow = "";
  }, 9500);

  // ==========================================================================
  //  Form Validation
  // ==========================================================================
  /**
   * @description This code sets up live validation (aka dynamic or real-time validation) for the email, message and name input.  This involves
   * setting a pattern or constraint, and dynamically validating
   * if the input given meets those pre-defined requirements.
   *   This function is used to provide immediate feedback to the user as they fill out the form.
   */

  if (!contactFormContainer) {
    // Check if the contact form container element was found.
    console.error("Error: .contact_form not found!");
    // Log an error message to the console if the element is missing.
    return; // Exit the function to prevent further errors.
  }

  // Attaching the function to run through each of the elements.
  validateInput(nameField, /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, 2); // Name field: validates the name field using the specified regex and minimum length.
  validateInput(
    emailField,
    /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    6
  ); // Email Field: validates the email field using the specified regex and minimum length.
  validateInput(messageField, /.+/, 10); // Message must have at least 10 chars: validates the message field, ensuring it has at least 10 characters.

  // ==========================================================================
  //  Form Submission
  // ==========================================================================

  /**
   * @description
   *  This function handles the submission of the contact form using AJAX.  It collects the
   * form data, sends it to the server, and displays a success or error message based on the
   * server's response.
   *   This function prevents the default form submission behavior and uses AJAX to send the form data to the server.
   */
  blankContactForm.addEventListener("submit", function (event) {
    // Attach an event listener to the form's submit event.
    event.preventDefault(); // Prevent default form submission: prevents the page from reloading.

    submitButton.disabled = true; // Disable submit button: prevents the user from submitting the form multiple times.

    let submittedContactForm = document.getElementById("contact-form"); // This line is redundant because it's already selected at the top.

    let formData = new FormData(submittedContactForm); // Create a FormData object from the form.

    fetch(submittedContactForm.action, {
      // Send the form data to the server using the fetch API.
      method: submittedContactForm.method, // Use the form's method attribute (POST).
      body: formData, // Set the request body to the FormData object.
    })
      .then((response) => response.json()) // Convert the HTTP response to JSON: parse the JSON response from the server.
      .then((data) => {
        // Check if submission was successful
        if (data.success) {
          // If the submission was successful
          // Display success message
          displayAlert(
            "success",
            data.message,
            contactFormContainer,
            submittedContactForm
          );

          // Reset form and re-enable submit button
          submittedContactForm.reset(); // Reset the form to clear the input fields.
          submitButton.disabled = false; // Re-enable the submit button.

          // Clear the input fields
          submittedContactForm.elements["name"].classList.remove("is-valid"); // Remove the "is-valid" class from the name field.
          submittedContactForm.elements["email"].classList.remove("is-valid"); // Remove the "is-valid" class from the email field.
          submittedContactForm.elements["message"].classList.remove("is-valid"); // Remove the "is-valid" class from the message field.
        } else {
          // If any error occurred, do the following
          // Display error message
          displayAlert(
            "danger",
            data.message,
            contactFormContainer,
            submittedContactForm
          );

          // Re-enable submit button
          submitButton.disabled = false; // Ensure the submit button is re-enabled even if there is an error
        }
      })
      .catch((error) => {
        // Log error and display a generic error message
        console.error("Error:", error); // Log the error to the console.
        displayAlert(
          "danger",
          "An error occurred. Please try again.",
          contactFormContainer,
          submittedContactForm
        );

        submitButton.disabled = false; // Ensure button is re-enabled
      });

    loadRecaptcha(); // reload recaptcha after submission
  });
});

// ==========================================================================
//  Helper Functions
// ==========================================================================
/**
 * @function validateInput
 * @description Adds an event listener to a form field for live validation.
 * @param {HTMLInputElement|HTMLTextAreaElement} field - The input field to validate.
 * @param {RegExp} regex - The regular expression to test the input against.
 * @param {number} [minLength=null] - The minimum length of the input (optional).
 *   This function provides real-time validation feedback to the user as they type in the form fields.
 */
function validateInput(field, regex, minLength = null) {
  // This function validates the input of a form field in real-time.
  field.addEventListener("input", function () {
    // Add an event listener to the input field for the "input" event.
    const isValid =
      regex.test(field.value) &&
      (minLength ? field.value.length >= minLength : true);
    // Check if the input value matches the regular expression and meets the minimum length requirement (if specified).

    if (isValid) {
      // If the input is valid
      field.classList.remove("is-invalid"); // Remove the "is-invalid" class.
      field.classList.add("is-valid"); // Add the "is-valid" class.
    } else {
      // If the input is invalid
      field.classList.remove("is-valid"); // Remove the "is-valid" class.
      field.classList.add("is-invalid"); // Add the "is-invalid" class.
    }
  });
}

/**
 * @function displayAlert
 * @description Displays an alert message above a specific element on the page.
 *
 * @param {string} type - "success" or "danger", determines the style of the alert.
 * @param {string} message - The message to display in the alert.
 * @param {HTMLElement} contactFormContainer - Element to insert the alert above.
 * @param {HTMLFormElement} contactForm - The contact form itself.
 *   This function is used to display success or error messages to the user after they submit the form.
 */
function displayAlert(type, message, contactFormContainer, contactForm) {
  // This function displays an alert message above a specific element on the page.
  // Remove existing alerts of the same type before adding a new one
  const existingAlerts = document.querySelectorAll(".alert"); // Select all elements with the class "alert".
  if (existingAlerts.length > 0) {
    // If there are any existing alerts
    existingAlerts.forEach((alertMessage) => alertMessage.remove()); // Remove each existing alert.
  }

  // Create a new alert element
  const alertDiv = document.createElement("div"); // Create a new div element.
  alertDiv.className = `alert alert-${type}`; // Set the class name of the div to "alert alert-{type}" (e.g., "alert alert-success" or "alert alert-danger").
  alertDiv.textContent = message; // Set the text content of the div to the specified message.

  // Insert the alert before the contact form
  contactFormContainer.insertBefore(alertDiv, contactForm); // Insert the alert div before the contact form.

  // Remove alert after 5 seconds
  setTimeout(() => {
    // After 5 seconds
    if (alertDiv) alertDiv.remove(); // Remove the alert div (if it still exists).
  }, 5000);
}

/**
 * @function loadRecaptcha
 * @description Loads the reCAPTCHA script and renders the reCAPTCHA widget.
 *
 */
function loadRecaptcha() {
  grecaptcha.ready(function () {
    grecaptcha
      .execute(reCAPTCHASiteKey, { action: "submit" })
      .then(function (token) {
        document.getElementById("recaptchaToken").value = token;
      });
  });
}
