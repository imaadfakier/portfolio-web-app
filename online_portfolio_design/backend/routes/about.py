from flask import Blueprint, render_template
from backend.models.about import TechnicalSkillCategory
from typing import List  # Import for type hinting

# ----- About Page -----
# Define a Flask Blueprint for the about page
# Blueprints help organize a Flask application by grouping related views and other code.
about_bp = Blueprint("about", __name__, url_prefix="/about")


@about_bp.route(
    ""
)  # Maps the root URL ("/") within the Blueprint to the about() function
def about():
    """
    Renders the about page (about.html) with technical skill categories and their skills.

    This route handler retrieves all technical skill categories from the database
    and passes them to the 'about.html' template for rendering.  The template then
    iterates through these categories and displays the associated skills.

    Returns:
        tuple: A tuple containing:
            - The rendered HTML content of the 'about.html' template (as a string).
            - The HTTP status code 200 (OK), indicating successful retrieval and rendering.
    """
    # Query the database to retrieve all technical skill categories.
    categories: List[TechnicalSkillCategory] = TechnicalSkillCategory.query.all()
    # Use type hinting to indicate that 'categories' is a list of TechnicalSkillCategory objects.

    # Render the 'about.html' template, passing the skill categories as 'skills_data'.
    # The template will use this data to display the skill information.
    return (
        render_template("about.html", skills_data=categories),
        200,
    )  # Explicitly return 200 OK
