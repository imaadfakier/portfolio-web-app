"""
This is the main application file for the Flask portfolio application.

It initializes the Flask application, configures the database and other extensions,
registers the blueprints for different routes, and starts the development server.

This module serves as the entry point for the application, orchestrating the
initialization of various components and starting the Flask development server.
"""

from dotenv import load_dotenv
import os  # Import the os module for interacting with the operating system
from flask import Flask, request, render_template  # Import necessary Flask modules
from config import get_config  # Import the function to retrieve the configuration
from backend.extensions import (
    init_extensions,
)  # Import the function to initialize Flask extensions
from backend.models import (
    db,
)  # Import the db instance from models/__init__.py for database access.
from backend.routes.home import (
    home_bp,
)  # Import blueprints for different routes: home_bp for the home route
from backend.routes.about import (
    about_bp,
)  # Import blueprints for different routes: about_bp for the about route
from backend.routes.career import (
    career_bp,
)  # Import blueprints for different routes: career_bp for the career route
from backend.routes.projects import (
    projects_bp,
)  # Import blueprints for different routes: projects_bp for the projects route
from backend.routes.contact.contact import (
    contact_bp,
)  # Import blueprints for different routes: contact_bp for the contact route
from logger import logger

# Load environment variables from .env file
load_dotenv()


def create_app(config_name: str = "default") -> Flask:
    """
    Creates and configures the Flask application instance.

    This function initializes the Flask application, loads the configuration
    settings based on the environment, initializes Flask extensions,
    creates database tables, and registers blueprints for different routes.

    Args:
        config_name (str): The name of the configuration to use (default: 'default').

    Returns:
        Flask: The configured Flask application instance.
    """
    app = Flask(
        __name__, static_folder="static"
    )  # Initialize Flask app and serve static files from the 'static' folder.
    # Creates a new Flask application instance, specifying the static folder for serving static files (CSS, JavaScript, images).

    # Load the configuration
    app.config.from_object(get_config(config_name))
    # Loads the configuration settings from the appropriate configuration class based on the provided `config_name`.

    # Initialize extensions
    init_extensions(app)  # Initialize Flask extensions such as Mail and SQLAlchemy.
    # Initializes Flask extensions, such as Flask-Mail and SQLAlchemy, and attaches them to the application.
    db.init_app(app)
    # Initializes the database connection with the Flask application.

    # Initialize database
    with app.app_context():  # Need an application context to create the database.
        # Creates an application context, which is required for performing database operations outside of a request context.
        db.create_all()  # Create database tables if they don't exist.
        # Creates the database tables based on the defined models, if they don't already exist.

    return app
    # Returns the configured Flask application instance.


app = create_app(os.getenv("FLASK_ENV") or "default")
# Creates the Flask application instance, using the environment variable
# FLASK_ENV to determine the configuration to use (defaults to "default").

# **************************************************************

# ***** LOGGING CONFIGURATION *****
"""
Configure logging. Replace print statements for better control over log levels and formatting.
"""
# Attach logger to Flask's internal logging system
app.logger.handlers = logger.handlers
app.logger.setLevel(
    logger.level
)  # Use the logger's existing level instead of re-importing logging.INFO

logger.info("Flask application server started successfully!")

# **************************************************************


# ***** "HELPER" DECORATORS *****
@app.before_request
def log_request():
    """
    Logs each request before it is processed.
    """
    logger.info(f"Request: {request.method} {request.url}")


@app.errorhandler(404)
def page_not_found(
    error,
):  # Changed 'e' to 'error' for clarity, as it represents the exception
    """
    Handles 404 (Page Not Found) errors and renders a custom error page.

    This function is registered with Flask to be invoked whenever a 404 error occurs
    in the application (i.e., when a user tries to access a URL that doesn't exist).
    It renders a custom HTML template (404.html) to provide a user-friendly error message
    instead of the default browser error page.

    Args:
        error: The exception object representing the 404 error.  While this argument
               is present, it's not explicitly used in this simple implementation,
               but it can be useful for logging or more detailed error reporting.

    Returns:
        tuple: A tuple containing:
            - The rendered HTML content of the "404.html" template (as a string).
            - The HTTP status code 404, indicating that the page was not found.  This
              status code is crucial for SEO and proper client-side handling of the error.
    """
    # Render the '404.html' template using Flask's render_template function.
    # This function locates the template file within the 'templates' directory
    # (or a configured template directory) and generates the HTML output.
    return render_template("404.html"), 404
    # Renders the '404.html' template with a 404 status code.


# **************************************************************

# ***** ESTABLISHING ALL ROUTES *****
"""
Register blueprints for different parts of the application.
"""
# home routes inception (/index + API routes)
app.register_blueprint(home_bp)  # Register the home blueprint
# Register the home blueprint with the application.

# about routes inception (/about + API routes)
app.register_blueprint(about_bp)  # Register the about blueprint
# Register the about blueprint with the application.

# career routes inception (API routes + /career)
app.register_blueprint(career_bp)  # Register the career blueprint
# Register the career blueprint with the application.

# projects routes inception (API routes + /projects & /projects/<int:page_number>)
app.register_blueprint(projects_bp)  # Register the projects blueprint
# Register the projects blueprint with the application.

# contact routes inception (/contact + API routes)
app.register_blueprint(contact_bp)  # Register the contact blueprint
# Register the contact blueprint with the application.

# ***********************************

# ***** APP EXECUTION *****
if __name__ == "__main__":
    app.run(debug=app.config["DEBUG"])


# *************************
