from flask import (
    Blueprint,
    request,
    jsonify,
    render_template,
)  # Import all necessary Flask modules
from backend.routes.cv_generator.cv_generator_form import (
    CVGeneratorForm,
)  # Import the CVGeneratorForm class for form handling
from backend.routes.utils import (
    verify_recaptcha,
)  # Import the reCAPTCHA verification utility function
from typing import Tuple  # Import for type hinting

# Importing modules specific to this blueprint - keeping these local improves clarity.
# from backend.routes.cv_generator.cv_generator_bot import get_tailored_cv
# from backend.routes.cv_generator.create_pdf import convert_to_pdf


# Initialize Blueprint
cv_generator_bp = Blueprint(
    "cv_generator", __name__, url_prefix="/cv-generator"
)  # Clear blueprint initialization.  Use a descriptive name.
# Blueprint for CV generator-related routes, prefixed with "/cv-generator"


@cv_generator_bp.route("", methods=["GET", "POST"])
def generate_cv() -> (
    Tuple[str, int] | str
):  # Use descriptive and pep8-compliant name, adds return type hinting
    """
    Handles the CV generation form submission.

    This route handles both GET and POST requests to the CV generator page.
    - On a GET request, it renders the CV generation form.
    - On a POST request, it validates the form data, verifies the reCAPTCHA,
      and triggers the CV generation process if validation passes.
    - Returns JSON responses for AJAX-based submissions, including success/failure status
      and error messages.
    """
    form = CVGeneratorForm()  # Create an instance of the CVGeneratorForm

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
            )  # Return a JSON response with the errors and a 400 Bad Request status

        token = request.form.get(
            "recaptcha_response"
        )  # Get the reCAPTCHA response token from the form data

        if not token:  # If the reCAPTCHA token is missing
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "reCAPTCHA token missing. Please re-submit.",
                    }
                ),
                400,
            )  # Return a JSON response indicating that reCAPTCHA verification failed

        if verify_recaptcha(token):  # If the reCAPTCHA verification is successful
            # Form details
            job_description = form.message.data
            # Getting the message data

            # Assuming CV generation is successful here.  Replace with actual logic.
            #  This needs to actually trigger the CV generation process!
            # For now, just simulate success.

            # ***Replace this section with your CV generation logic***
            # *******************************************************
            try:
                # CV generation process here using 'message' or other form data
                # Assuming CV generation is triggered here successfully.

                # # Step 2.1.1: Trigger your Python bot to interact with Google AI Studio.
                # tailored_cv_text = get_tailored_cv(job_description)

                # # Step 2.1.2: Generate a PDF from the tailored CV text.
                # tailored_cv_pdf = convert_to_pdf(
                #     job_description
                # )  # Calls the automation function

                # This should be replaced with the actual generated PDF path.
                # Consider using a temporary file.
                # pdf_path = "dummy_cv.pdf"  # Using a dummy PDF for now.

                # # Return the PDF as a downloadable file.
                # return send_file(
                #     pdf_path,
                #     as_attachment=True,
                #     download_name=f"Imaad Fakier - CV - {datetime.datetime.now().strftime('%d%m%y')}.pdf",  # Construct a descriptive filename.
                # )

                # return redirect(url_for("cv_generator.generate_cv")) # No redirect, send a success json
                return (
                    jsonify(
                        {
                            "success": True,
                            "message": "CV generation initiated successfully!",  # change as needed
                        }
                    ),
                    200,
                )  # Return a JSON response indicating that CV generation was initiated successfully
            except Exception as e:
                # Handle CV generation errors.
                return (
                    jsonify(
                        {
                            "success": False,
                            "message": f"CV generation failed: {str(e)}",
                        }
                    ),
                    500,
                )  # Return a JSON response indicating that CV generation failed

            # *******************************************************

        else:  # If the reCAPTCHA verification fails
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
        "cv_generator.html", form=form
    )  # Render the 'cv_generator.html' template with the form object
