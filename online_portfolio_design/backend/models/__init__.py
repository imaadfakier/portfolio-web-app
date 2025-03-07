from flask_sqlalchemy import SQLAlchemy  # Import the SQLAlchemy integration for Flask


# Initialize the database instance (shared across the application)
# This creates the database object that will be used to interact with the database.
# Note: This does not connect to the database yet. The connection is established when
# the application context is available (e.g., within a route or during initialization).
db = SQLAlchemy()
# Create an instance of SQLAlchemy class, and will be bound to the flask app later on in the process.
