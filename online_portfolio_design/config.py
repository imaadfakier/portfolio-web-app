"""
This module defines the configuration settings for the Flask application.

It uses environment variables to configure the application, providing default values
if the environment variables are not set.  This allows for flexibility in different
deployment environments.

Environment variables are used to store sensitive information (like API keys and database passwords)
separately from the code, which enhances security and makes it easier to manage configurations
across different environments (development, testing, production).
"""

import os  # Import the os module for interacting with the operating system, including environment variables


# Since environment variables are always strings, you need to convert them properly. The best
# way is to check for common true values ("true", "1") and assume everything else is False.
def str_to_bool(value: str) -> bool:
    return value.lower() in ("true", "1", "yes", "on")


class Config:
    """
    Base configuration class.  Sets default values and attempts to load
    settings from environment variables.

    This class provides a central place to manage application-wide configuration settings.
    It defines default values for various parameters and attempts to load these values from
    environment variables, allowing for customization without modifying the code directly.
    """

    basedir = os.path.abspath(
        os.path.dirname(__file__)
    )  # Define the base directory of the application: sets the base directory to the directory
    # containing this file, which is useful for constructing absolute paths.

    FLASK_ENV = os.environ.get(
        "FLASK_ENV"
    )  # Get the flask environment settings from the environment.

    # Enable debug mode
    DEBUG = os.environ.get(
        "DEBUG"
    )  # Enable debug mode: Enables or disables debug mode, which provides detailed error messages
    # and other helpful information during development.

    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URI"
    )  # Get the database URI from the environment.

    SQLALCHEMY_TRACK_MODIFICATIONS = str_to_bool(
        str(os.environ.get("SQLALCHEMY_TRACK_MODIFICATIONS"))
    )  # Disables SQLAlchemy's tracking of database modifications for performance: reduces overhead.

    # Mail configuration
    MAIL_SERVER = os.environ.get(
        "MAIL_SERVER"
    )  # Get the mail server from the environment.

    MAIL_PORT = int(
        str(os.environ.get("MAIL_PORT"))
    )  # Get the mail port from the environment.

    MAIL_USE_TLS = str_to_bool(
        str(os.environ.get("MAIL_USE_TLS"))
    )  # Get the TLS setting from the environment.

    MAIL_USERNAME = os.environ.get(
        "MAIL_USERNAME"
    )  # Get the mail username from the environment.

    MAIL_PASSWORD = os.environ.get(
        "MAIL_PASSWORD"
    )  # Get the mail password from the environment

    # reCAPTCHA configuration
    RECAPTCHA_PUBLIC_KEY = os.environ.get(
        "RECAPTCHA_PUBLIC_KEY"
    )  # Get the reCAPTCHA public key from the environment.
    RECAPTCHA_PRIVATE_KEY = os.environ.get(
        "RECAPTCHA_PRIVATE_KEY"
    )  # Get the reCAPTCHA private key from the environment.

    # General security key
    SECRET_KEY = os.environ.get(
        "SECRET_KEY"
    )  # Get the secret key from the environment.


class DevelopmentConfig(Config):
    """
    Development configuration - Enables debugging.

    This configuration is specifically designed for development environments,
    enabling debugging features and potentially using a different database or
    other settings optimized for local development.
    """

    DEBUG = True  # Enable debug mode


class ProductionConfig(Config):
    """
    Production configuration - Intended for the production environment.

    This configuration is intended for production environments, disabling debugging
    and ensuring that sensitive data is loaded from secure environment variables.
    """

    # Disable debug mode in production for security reasons.
    DEBUG = False


# You can add a function to choose the correct config based on an environment variable
def get_config(config_name: str) -> type[Config]:
    """
    Retrieves the configuration class based on the environment variable `FLASK_ENV`.

    Args:
        config_name: A string indicating the configuration to use (e.g., "development", "production").

    Returns:
        The appropriate configuration class.
    """
    config = {
        "development": DevelopmentConfig,
        "production": ProductionConfig,
        "default": Config,
    }
    # A dictionary mapping configuration names to their respective classes.

    return config.get(
        config_name, config["default"]
    )  # Returns the configuration class associated with the provided name, or the default configuration if the name is not found.
