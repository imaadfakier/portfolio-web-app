"""
This module initializes and configures Flask extensions such as Flask-Mail.
It also provides functions to configure application-level settings.

Flask extensions provide reusable functionality to Flask applications, such as
database integration, email sending, and form handling. This module centralizes
the configuration and initialization of these extensions.
"""

from flask import Flask
from flask_mail import Mail  # Import the Mail class from Flask-Mail

# Initialize Flask-Mail extension
mail = (
    Mail()
)  # Create an instance of the Mail class, but don't associate it with an app yet.


def configure_database(app: Flask):
    """
    Configures the SQLAlchemy database settings for the Flask application.

    This function retrieves the database URI from the application configuration
    and sets the `SQLALCHEMY_DATABASE_URI` and `SQLALCHEMY_TRACK_MODIFICATIONS`
    settings.  It's crucial to call this function before using the database.

    Args:
        app: The Flask application instance.
    """
    # Database URI
    app.config["SQLALCHEMY_DATABASE_URI"] = app.config.get(
        "SQLALCHEMY_DATABASE_URI"
    )  # Get the database URI from the application configuration.  Defaults to None if not set.
    # Sets the SQLAlchemy database URI from the application's configuration, which defines how to connect to the database.

    # Disable tracking modifications, as it can be resource-intensive. It is recommended to set this explicitly
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = app.config.get(
        "SQLALCHEMY_TRACK_MODIFICATIONS"
    )  # Consider setting a default value (False) in case it's not defined in the environment.
    # Disables SQLAlchemy's modification tracking, which can improve performance, especially in production environments.
    # It is recommended to set this explicitly to avoid potential warnings.


def configure_mail(app: Flask):
    """
    Configures Flask-Mail settings for the Flask application.

    This function retrieves the mail server settings from the application
    configuration and sets the corresponding Flask-Mail configuration options.
    These settings are required to send emails from the application.

    Args:
        app: The Flask application instance.
    """
    # Mail server settings
    app.config["MAIL_SERVER"] = app.config.get(
        "MAIL_SERVER"
    )  # Hostname or IP address of your mail server.
    # Sets the hostname or IP address of the mail server used to send emails.
    app.config["MAIL_PORT"] = app.config.get(
        "MAIL_PORT"
    )  # Port number of your mail server.
    # Sets the port number of the mail server.
    app.config["MAIL_USE_TLS"] = app.config.get(
        "MAIL_USE_TLS"
    )  # Whether to use TLS encryption. Consider setting a default.
    # Sets whether to use Transport Layer Security (TLS) encryption when connecting
    # to the mail server. It is generally recommended to use TLS for security.
    app.config["MAIL_USERNAME"] = app.config.get(
        "MAIL_USERNAME"
    )  # Username for your mail server.
    # Sets the username used to authenticate with the mail server.
    app.config["MAIL_PASSWORD"] = app.config.get(
        "MAIL_PASSWORD"
    )  # Password for your mail server.
    # Sets the password used to authenticate with the mail server.  **WARNING: Never
    # store passwords directly in code! Use environment variables or a secure configuration
    # management system.**


def configure_recaptcha(app: Flask):
    """
    Configures reCAPTCHA settings for the Flask application.

    This function retrieves the reCAPTCHA API keys from the application
    configuration and sets the corresponding Flask configuration options.
    These keys are required to use the reCAPTCHA service to protect against bots.

    Args:
        app: The Flask application instance.
    """
    # Security key
    app.config["SECRET_KEY"] = app.config.get("SECRET_KEY")  # App secret key.
    # Sets the application's secret key, which is used for various security-related tasks.
    # It is essential to set a strong, random secret key in production.

    # reCAPTCHA API keys
    app.config["RECAPTCHA_PUBLIC_KEY"] = app.config.get(
        "RECAPTCHA_PUBLIC_KEY"
    )  # Google reCAPTCHA site key
    # Sets the public key for the reCAPTCHA service, which is used in the client-side code.
    app.config["RECAPTCHA_PRIVATE_KEY"] = app.config.get(
        "RECAPTCHA_PRIVATE_KEY"
    )  # Google reCAPTCHA secret key
    # Sets the private key for the reCAPTCHA service, which is used for server-side verification.
    # **WARNING: Never expose the private key in client-side code or commit it to version control!**


def init_extensions(app: Flask):
    """
    Initializes Flask extensions and attaches them to the application.

    This function initializes the Flask extensions used in the application,
    such as Flask-Mail and SQLAlchemy.  It also calls the configuration
    functions to set up the extension-specific settings.

    Args:
        app: The Flask application instance.
    """
    configure_database(app)  # Configure Database
    # Configures the SQLAlchemy database settings.
    mail.init_app(app)  # Initialize the Flask-Mail extension with the application.
    # Initializes the Flask-Mail extension and associates it with the Flask application instance.
    configure_mail(app)  # Configure Mail
    # Configures the Flask-Mail settings.
    configure_recaptcha(app)  # Configure ReCaptcha
    # Configures the reCAPTCHA settings.
