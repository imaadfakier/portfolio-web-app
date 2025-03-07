from backend.models import db  # Import the shared db instance
from sqlalchemy import Column, Integer, String, Text  # Import necessary column types
import json  # Import the json module for working with JSON data


# ----------------------------------------------
# Overview Model
# ----------------------------------------------
class Overview(db.Model):
    """
    Represents a general overview section (e.g., a bio or summary).

    This model defines the structure for storing a general overview section
    in the database. It is used to store information such as a bio or summary
    that provides context for the projects.
    """

    __tablename__ = "overview"  # Optional: Explicitly define the table name

    id = Column(Integer, primary_key=True)
    # Unique identifier for the overview entry.

    overview_data = Column(
        Text, nullable=False
    )  # JSON string containing overview data: Stores the overview information as a JSON string.
    # The actual content to be displayed.

    def to_dict(self):
        """
        Convert overview object to dictionary format for JSON serialization.

        This method converts the database model object into a Python dictionary,
        making it easy to serialize as JSON for API responses.  It also deserializes
        the JSON string stored in the `overview_data` field.
        """
        return {
            "id": self.id,
            "overview_data": json.loads(
                self.overview_data
            ),  # Deserialize JSON string:  Loads the JSON data from the `overview_data` field.
        }

    def __repr__(self):
        return f"<Overview(id='{self.id}')>"


# ----------------------------------------------
# Project Model
# ----------------------------------------------
class Project(db.Model):
    """
    Represents a project entry.

    This model defines the structure for storing project information in the database,
    such as project name, description, GitHub link, and other details.
    """

    __tablename__ = "project"  # Optional: Explicitly define the table name

    id = Column(Integer, primary_key=True)
    # Unique identifier for the project.
    name = Column(String(100), nullable=False)  # Project name: The name of the project.
    description = Column(
        Text, nullable=False
    )  # Project description: A detailed description of the project.
    github_link = Column(
        String(200), nullable=False
    )  # GitHub repository link: Link to the project's GitHub repository.
    project_image = Column(
        String(200), nullable=True
    )  # Project image (optional):  Link to an image representing the project.
    demo_link = Column(
        String(200), nullable=True
    )  # Live demo link (optional):  Link to a live demo of the project.
    technical_details = Column(
        Text, nullable=True
    )  # JSON-encoded technical details: Technical specifications.
    key_learnings = Column(
        Text, nullable=False
    )  # Key takeaways from the project: Learnings while working on it.
    status = Column(
        String(50), nullable=False
    )  # Project status (e.g., Completed, In Progress): current status of the project.
    demonstration = Column(
        String(500), nullable=True
    )  # Link to a demonstration video or article: URL link.

    def to_dict(self):
        """
        Convert project object to dictionary format for JSON serialization.

        This method transforms the database model object into a Python dictionary,
        making it easy to serialize as JSON for API responses. It also handles
        deserializing the JSON string stored in the `technical_details` field,
        with robust error handling to prevent issues if the field contains invalid JSON.
        """
        try:
            technical_details = (
                json.loads(self.technical_details) if self.technical_details else {}
            )
        except (TypeError, json.JSONDecodeError):
            technical_details = (
                {}
            )  # Or handle the error more gracefully: If there's a JSON error, return an empty dictionary rather than crashing.

        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "github_link": self.github_link,
            "project_image": self.project_image,
            "demo_link": self.demo_link,
            "technical_details": technical_details,
            "key_learnings": self.key_learnings,
            "status": self.status,
            "demonstration": self.demonstration,
        }

    def __repr__(self):
        return f"<Project(name='{self.name}', status='{self.status}')>"
