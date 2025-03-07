from flask_wtf import FlaskForm  # Import FlaskForm, the base class for WTForms in Flask
from wtforms import (
    TextAreaField,
)  # Import the TextAreaField type for multi-line text input
from wtforms.validators import (
    DataRequired,
    Length,
)  # Import validators for ensuring the field is not empty and has a specific length


class CVGeneratorForm(FlaskForm):
    """
    Form for submitting a job description to generate a tailored CV.

    This form is used to collect the job description from the user, which is then used
    to generate a tailored CV using some backend process (e.g., a large language model).
    """

    message = TextAreaField(
        "Message",  # Label for the form field: Descriptive label for the textarea.
        validators=[
            DataRequired(message="Job description is required."),
            # Ensures the field is not empty: Prevents submission if the user hasn't entered any text.
            Length(
                min=100,
                max=100000,
                message="Job description must be between 100 and 100000 characters.",
            ),
            # Limits the length of the job description for processing. Consider making this configurable.
            # Restricts the input to a reasonable size to prevent excessively long submissions and potential performance issues.
        ],
        description="Enter the job description here.",  # Added description for better UX
        # Provides helpful guidance to the user.
    )  # A TextAreaField is used for the job description so the user can copy and paste the text.

    # recaptcha = RecaptchaField() # Consider enabling if you're experiencing spam
