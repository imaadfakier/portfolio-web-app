from flask import Blueprint, render_template

# Define a Flask Blueprint for the home page
# Blueprints are a way to organize a group of related views and other code.
# In this case, we're creating a Blueprint named 'home' to handle routes
# related to the home page.
home_bp = Blueprint("home", __name__, url_prefix="/")


@home_bp.route("")  # Maps the root URL ("/") to the index function
def index():
    """
    Handles the root URL ("/") and renders the home page (index.html).

    This function is responsible for displaying the main landing page of the application.
    It uses the `render_template` function from Flask to generate the HTML content
    by combining the 'index.html' template file with any necessary data (in this case, none).

    Returns:
        str: Rendered HTML content of the index page.
    """
    # Use Flask's render_template function to load the 'index.html' template and
    # return the resulting HTML string to the client (web browser).
    # The render_template function searches for the template file in the 'templates' folder
    # (by default, but this can be configured).
    return render_template("index.html")
