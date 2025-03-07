/**
 * @file cv_generator.js
 * @description This file contains JavaScript code specific to the CV generator page.
 * It handles animation triggers, form validation, the reCAPTCHA loading, and form submission.
 */

document.addEventListener("DOMContentLoaded", function () {
  // This event listener ensures that the code executes only after the
  // entire HTML document has been fully loaded and parsed.

  // const allForms = document.querySelectorAll("form");
  // console.log("All forms on the page:", allForms);  // Debugging line (remove in production)

  // ==========================================================================
  //  Element Selection
  // ==========================================================================

  // Selects various elements on the page for manipulation and animation.
  const tbaParagraph = document.querySelector(".tba-overlay p");
  // select the  paragraph in HTML

  const ellipses = document.querySelector(".tba-overlay .dots"); // Select the loading text element.
  // select the html for loading text
  let dotCount = 0; // Initialize the dot counter.
  // start a var for counting

  setInterval(() => {
    // Animate the loading dots.
    dotCount = (dotCount + 1) % 4; // Increment the dot count, looping from 0 to 3.
    // loop though the animation
    ellipses.textContent = ".".repeat(dotCount); // Update the text content with the appropriate number of dots.
    // add those animation dots
  }, 400); // Update every 400 milliseconds.
  // time to load the text content

  // Set a timeout to fade out the paragraph after a delay
  setTimeout(() => {
    // set the timer
    tbaParagraph.classList.add("fadeOut");
    // and add "fadeOut" to the css

    // Optional: Remove the paragraph from the DOM after it fades out
    setTimeout(() => {
      // set another timer for the 2nd section
      tbaParagraph.style.display = "none"; // Or tbaParagraph.remove();
      // change the display to none.
    }, 500); // Match the animation duration, set for 500
  }, 7500); // Delay in milliseconds (e.g., 3000 = 3 seconds), set 7500ms

  const cvGenerationHeader = document.querySelector("h2.hidden_slide_in"); // "Generate Tailor-Made CV" header
  const cvGenerationSubHeader = document.querySelector(
    ".cv_generation_sub_header"
  ); // "Enter Job Description:" subheader
  const cvGeneratorFormContainer = document.querySelector(".cv_generator_form"); // The form container
  const cvGeneratorForm = document.getElementById("cv-generator-form"); // The form element
  const formTextArea = document.getElementById("message"); // The textarea for the job description
  const submitButton = document.querySelector("button[type='submit']"); // The submit button
  const loadingOverlay = document.getElementById("loading-overlay"); // The loading overlay
  const footerSection = document.querySelector(".footer"); // The footer section

  // ==========================================================================
  //  Initial Footer Styling
  // ==========================================================================

  //Hides Footer to prevent overlap
  // footerSection.style.display = "none";  // Commented out, so it's not currently doing anything

  // ==========================================================================
  //  Content Animation
  // ==========================================================================
  /**
   * @description sets up and manages the smooth transitions in and load in the CV form and elements
   *   This function uses timeouts to trigger CSS animations and transitions on the page elements.
   */

  // Trigger animations with staggered delays:
  setTimeout(() => {
    // After 6.25 seconds, make the CV generation header appear.
    cvGenerationHeader.classList.add("visible");
  }, 6250);

  setTimeout(() => {
    // After 9 seconds, make the CV generation subheader appear.
    cvGenerationSubHeader.classList.add("visible");
  }, 9000);

  setTimeout(() => {
    // After 9.75 seconds, make the form textarea appear.
    formTextArea.classList.add("visible");
  }, 9250);

  setTimeout(() => {
    // After 12.5 seconds, make the submit button appear.
    submitButton.classList.add("visible");
  }, 11750);

  //Makes the Footer Visibile to the user
  setTimeout(() => {
    // After 13 seconds, make the footer appear.
    // footerSection.style.display = "block";
    footerSection.classList.add("visible");
  }, 12250);

  // ==========================================================================
  //  Form Validation
  // ==========================================================================

  /**
   * @description Sets up live validation for the input.  Validation occurs as the input changes.
   *   This function uses the `validateInput` helper function to provide real-time feedback to the user.
   */
  validateInput(formTextArea, /.+/, 100); // Message must have at least 100 chars: use Regex.

  // ==========================================================================
  //  Form Submission
  // ==========================================================================

  /**
   * @description
   *  This function handles the submission of the CV generator form using AJAX.  It collects the
   * form data, sends it to the server, and displays a success or error message based on the
   * server's response.
   *   This function prevents the default form submission behavior and uses AJAX to send the form data to the server.
   */
  cvGeneratorForm.addEventListener("submit", function (event) {
    // Attach an event listener to the form's submit event.
    event.preventDefault(); // Prevent default form submission: prevents the page from reloading.

    submitButton.disabled = true; // Disable submit button: prevents the user from submitting the form multiple times.

    let submittedCvGeneratorForm = event.target; // get the element that was acted on
    console.log(submittedCvGeneratorForm); // Debug log for debugging purposes (remove in production)

    let formData = new FormData(submittedCvGeneratorForm); // Create a FormData object from the form.

    // console.log(submittedCvGeneratorForm.action);  // Debug log for debugging purposes (remove in production)

    loadingOverlay.classList.add("show"); // Show the overlay: displays a loading screen to the user.

    fetch(submittedCvGeneratorForm.action, {
      // Send the form data to the server using the fetch API.
      method: submittedCvGeneratorForm.method, // Use the form's method attribute (POST).
      body: formData, // Set the request body to the FormData object.
    })
      .then((response) => response.json()) // Convert the HTTP response to JSON: parse the JSON response from the server.
      .then((data) => {
        // Check if submission was successful
        if (data.success) {
          // If the submission was successful
          // console.log("Came in here!");  // Debug log for debugging purposes (remove in production)

          // Display success message
          displayAlert(
            "success",
            data.message,
            cvGeneratorFormContainer,
            submittedCvGeneratorForm
          );

          // Reset form and re-enable submit button
          submittedCvGeneratorForm.reset(); // Reset the form to clear the input fields.
          submitButton.disabled = false; // Re-enable the submit button.

          // Clear the input fields
          submittedCvGeneratorForm.elements["message"].classList.remove(
            "is-valid"
          ); //Only message field: Remove the "is-valid" class from the message field.

          // loadReCaptcha();
        } else {
          // If any error occurred, do the following
          // console.log("Came in here! [Error]");  // Debug log for debugging purposes (remove in production)

          // Display error message
          displayAlert(
            "danger",
            data.message,
            cvGeneratorFormContainer,
            submittedCvGeneratorForm
          );

          // Re-enable submit button
          submitButton.disabled = false; //Re-enable the submit button so the form can be submitted again

          // loadReCaptcha();
        }
      })
      .catch((error) => {
        // Log error and display a generic error message
        console.error("Error:", error); // Log the error to the console.
        displayAlert(
          "danger",
          "An error occurred. Please try again.",
          cvGeneratorFormContainer,
          submittedCvGeneratorForm
        );

        submitButton.disabled = false; // Ensure button is re-enabled

        // loadReCaptcha();
      })
      .finally(() => {
        // Runs whether there are any error or not
        submitButton.disabled = false; // Re-enable the button
        loadingOverlay.classList.remove("show"); // Hide the overlay
      });

    loadReCaptcha(); // call loadReCaptcha
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
 * @param {HTMLElement} formContainer - Element to insert the alert above.
 * @param {HTMLFormElement} submittedForm - The contact form itself.
 *   This function is used to display success or error messages to the user after they submit the form.
 */
function displayAlert(type, message, formContainer, submittedForm) {
  // This function displays an alert message above a specific element on the page.
  // Remove existing alerts of the same type before adding a new one
  const existingAlerts = document.querySelectorAll(`.alert`); // Select all elements with the class "alert".
  if (existingAlerts.length > 0) {
    // If there are any existing alerts
    existingAlerts.forEach((alertMessage) => alertMessage.remove()); // Remove each existing alert.
  }

  // Create a new alert element
  const alertDiv = document.createElement("div"); // Create a new div element.
  alertDiv.className = `alert alert-${type}`; // Set the class name of the div to "alert alert-{type}" (e.g., "alert alert-success" or "alert alert-danger").
  alertDiv.textContent = message; // Set the text content of the div to the specified message.

  // Insert the alert before the contact form
  formContainer.insertBefore(alertDiv, submittedForm); // Insert the alert div before the contact form.

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
function loadReCaptcha() {
  grecaptcha.ready(function () {
    grecaptcha
      .execute(reCAPTCHASiteKey, { action: "submit" })
      .then(function (token) {
        document.getElementById("recaptchaToken").value = token;
      });
  });
}
