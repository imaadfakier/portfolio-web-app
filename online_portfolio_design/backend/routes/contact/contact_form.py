from flask_wtf import FlaskForm  # Import FlaskForm, the base class for WTForms in Flask
from wtforms import StringField, TextAreaField  # Import the field types for the form
from wtforms.validators import (
    DataRequired,
    Email,
    Length,
    Regexp,
)  # Import the validators for the fields


# Contact form using Flask-WTF for validation
class ContactForm(FlaskForm):
    """
    Defines the structure and validation rules for the contact form.

    This form uses Flask-WTF to handle form processing and validation.  Each field
    is defined with specific validators to ensure that the user provides valid input.
    """

    name = StringField(
        "Name",
        validators=[
            DataRequired(message="Name is required"),
            # Ensures that the field is not empty
            Length(min=2, max=100, message="Name must be between 2 and 100 characters"),
            # Enforces a minimum and maximum length for the input
            Regexp(
                r"^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$",
                message="Enter a valid name",
            ),
            # Uses a regular expression to allow for international characters, spaces, hyphens, and apostrophes
        ],
        render_kw={"placeholder": "Your Name"},  # Adds a placeholder to improve UX
    )
    # A string field for the user's name

    email = StringField(
        "Email",
        validators=[
            DataRequired(message="Email is required"),
            # Ensures that the field is not empty
            Email(message="Enter a valid email address"),
            # Validates that the input is a valid email address format
            Length(
                min=6, max=120, message="Email must be between 6 and 120 characters"
            ),
            # Enforces a minimum and maximum length for the input
            Regexp(
                r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",
                message="Enter a valid email address",
            ),
            # Uses a regular expression to provide more robust email validation
        ],
        render_kw={
            "placeholder": "Your Email Address"
        },  # Adds a placeholder to improve UX
    )
    # A string field for the user's email address

    message = TextAreaField(
        "Message",
        validators=[
            DataRequired(message="Message is required"),
            # Ensures that the field is not empty
            Length(
                min=10,
                max=1000,
                message="Message must be between 10 and 1000 characters.",
            ),
            # Enforces a minimum and maximum length for the input
        ],
        render_kw={"placeholder": "Your Message"},  # Adds a placeholder to improve UX
    )
    # A text area field for the user's message, allowing for multi-line input

    # Uncomment if using reCAPTCHA
    # recaptcha = RecaptchaField()
