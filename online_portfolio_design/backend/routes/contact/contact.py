from flask import (
    Blueprint,
    render_template,
    request,
    jsonify,
    current_app,
)  # Import necessary Flask modules
from backend.extensions import (
    mail,
)  # Import initialized mail instance for sending emails
from flask_mail import Message  # Import Message class for constructing email messages
from backend.routes.contact.contact_form import (
    ContactForm,
)  # Import the ContactForm class for form handling
import requests  # Import the requests library for making HTTP requests

# Create a Blueprint for the contact route
contact_bp = Blueprint(
    "contact", __name__, url_prefix="/contact"
)  # Blueprint for contact-related routes, prefixed with "/contact"


def verify_recaptcha(token: str) -> bool:
    """
    Verifies the reCAPTCHA response using Google's API.

    This function sends a POST request to Google's reCAPTCHA API to verify
    the provided token.  It checks if the 'success' field in the JSON response
    is True, indicating that the reCAPTCHA verification was successful.

    Args:
        token (str): The reCAPTCHA response token received from the client-side.

    Returns:
        bool: True if the reCAPTCHA verification was successful, False otherwise.
              It also returns False if RECAPTCHA_PRIVATE_KEY is not configured.
    """
    secret_key = current_app.config.get(
        "RECAPTCHA_PRIVATE_KEY"
    )  # Get the reCAPTCHA private key from Flask's configuration
    if not secret_key:
        # If no secret key is found, the recaptcha function will fail
        return False  # Fails if no secret key is found

    url = "https://www.google.com/recaptcha/api/siteverify"
    # The URL for Google's reCAPTCHA API
    response = requests.post(
        url, data={"secret": secret_key, "response": token}
    )  # Send a POST request to the API with the secret key and token
    return response.json().get(
        "success", False
    )  # Return True if the verification was successful, False otherwise


@contact_bp.route("", methods=["GET", "POST"])
def contact():
    """
    Handles the contact form submission.

    This route handles both GET and POST requests to the contact page.
    - On a GET request, it renders the contact form.
    - On a POST request, it validates the form data, verifies the reCAPTCHA,
      and sends an email if validation passes.
    - Returns JSON responses for AJAX-based submissions, including success/failure status
      and error messages.
    """
    form = ContactForm()  # Create an instance of the ContactForm

    if request.method == "POST":  # If the request method is POST (form submission)
        if not form.validate_on_submit():  # If the form data is invalid
            return (
                jsonify(
                    {
                        "success": False,
                        "errors": form.errors,
                        "message": "Validation failed. Please try again.",
                    }
                ),
                400,
            )
            # Return a JSON response with the errors and a 400 Bad Request status

        token = request.form.get(
            "recaptcha_response"
        )  # Get the reCAPTCHA response token from the form data

        if not token:  # If the reCAPTCHA token is missing
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "reCAPTCHA verification failed! Please re-submit.",
                    }
                ),
                400,
            )  # Return a JSON response indicating that reCAPTCHA verification failed

        if verify_recaptcha(token):  # If the reCAPTCHA verification is successful
            # Extract form data
            name = form.name.data
            email = form.email.data
            message = form.message.data

            # Construct email message
            msg = Message(
                subject=f"New Contact Form Submission: {name}",
                sender=current_app.config["MAIL_USERNAME"],
                # The sender email address from the Flask configuration
                recipients=[current_app.config["MAIL_USERNAME"]],
                # The recipient email address from the Flask configuration
                reply_to=email,
                # The email address to reply to
                body=f"Name: {name}\n\nEmail: {email}\n\nMessage:\n\n{message}",
                # The body of the email message
            )

            # Send email
            mail.send(msg)
            # Send the email message using Flask-Mail

            return (
                jsonify(
                    {
                        "success": True,
                        "message": "Your message has been sent successfully!",
                    }
                ),
                200,
            )  # Return a JSON response indicating that the message was sent successfully
        else:
            # If the reCAPTCHA verification fails
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "reCAPTCHA verification failed! Please re-submit.",
                    }
                ),
                400,
            )  # Return a JSON response indicating that reCAPTCHA verification failed

    # If the request method is GET (rendering the form)
    return render_template(
        "contact.html", form=form
    )  # Render the contact form template and pass the form object
