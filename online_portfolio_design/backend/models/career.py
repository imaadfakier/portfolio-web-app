from backend.models import db  # Import the shared db instance
from sqlalchemy import Column, Integer, String, Text  # Import necessary column types


# ----------------------------------------------
# Work Experience Model
# ----------------------------------------------
class Experience(db.Model):
    """
    Represents a work experience entry.

    This model defines the structure for storing work experience information in the database,
    such as job title, company, duration, responsibilities, and skills.
    """

    __tablename__ = "experience"  # Optional: Explicitly define the table name

    id = Column(Integer, primary_key=True)
    image = Column(
        String(255), nullable=True
    )  # Image filename for company logo: Optional image for the company.
    title = Column(String(200), nullable=False)  # Job title:  The title of the job.
    company = Column(
        String(100), nullable=False
    )  # Company name: The name of the company.
    duration = Column(
        String(50), nullable=False
    )  # Work duration (e.g., 2020-2023): The period of employment.
    points = Column(
        Text, nullable=False
    )  # Responsibilities or achievements (newline-separated): Key responsibilities and accomplishments.
    skills = Column(
        Text, nullable=False
    )  # Skills used in this job (comma-separated): List of skills used in the job.

    def to_dict(self):
        """
        Convert experience object to dictionary format for JSON serialization.

        This method transforms the database model object into a Python dictionary,
        making it easy to serialize as JSON for API responses. It also handles
        the conversion of newline-separated points and comma-separated skills into lists.
        """
        return {
            "id": self.id,
            "image": self.image
            or "default-image.jpg",  # Provide default image if none available: if an image is not already provided
            "title": self.title,
            "company": self.company,
            "duration": self.duration,
            "points": self.points.split(
                "\n"
            ),  # Convert newline-separated points into list: Splits the string of points into an array, based on newline character separation
            "skills": self.skills.split(
                ", "
            ),  # Convert comma-separated skills into list:  Splits the string of skills into an array, based on commas.
        }

    def __repr__(self):
        return f"<Experience(title='{self.title}', company='{self.company}')>"


# ----------------------------------------------
# Education Model
# ----------------------------------------------
class Education(db.Model):
    """
    Represents an education entry.

    This model defines the structure for storing education information in the database,
    such as degree, institution, year, and additional information.
    """

    __tablename__ = "education"  # Optional: Explicitly define the table name

    id = Column(Integer, primary_key=True)
    image = Column(
        String(255), nullable=False
    )  # Institution logo/image: Image for the educational insitution.
    degree = Column(
        String(200), nullable=False
    )  # Degree name: Name of the degree earned.
    institution = Column(
        String(100), nullable=False
    )  # University/School name:  Name of the learning insitution.
    year = Column(
        String(50), nullable=False
    )  # Graduation year or study duration: Year of graduation, or duration of studying.
    additional_information = Column(
        Text, nullable=True
    )  # Additional info (newline-separated): Further details about the education.

    def to_dict(self):
        """
        Convert education object to dictionary format for JSON serialization.

        This method transforms the database model object into a Python dictionary,
        making it easy to serialize as JSON for API responses. It also handles
        the conversion of newline-separated additional information into a list.
        """
        return {
            "id": self.id,
            "image": self.image,
            "degree": self.degree,
            "institution": self.institution,
            "year": self.year,
            "additional_information": (
                self.additional_information.split("\n")
                if self.additional_information
                else []
            ),  # Splits the additional information into array, if there is any
        }

    def __repr__(self):
        return f"<Education(degree='{self.degree}', institution='{self.institution}')>"


# ----------------------------------------------
# Certificate Model
# ----------------------------------------------
class Certificate(db.Model):
    """
    Represents a certification entry.

    This model defines the structure for storing certification information in the database,
    such as title, issuing organization, link, and date of completion.
    """

    __tablename__ = "certificate"  # Optional: Explicitly define the table name

    id = Column(Integer, primary_key=True)
    title = Column(
        String(200), nullable=False
    )  # Certificate title: Name of the certificate.
    institution = Column(
        String(100), nullable=False
    )  # Issuing organization:  Name of the organization.
    link = Column(
        String(500), nullable=False
    )  # Link to certificate (if applicable): Link to view certificate.
    date = Column(
        String(20), nullable=False
    )  # Date of completion: The date when the certificate was issued.

    def to_dict(self):
        """
        Convert certificate object to dictionary format for JSON serialization.

        This method transforms the database model object into a Python dictionary,
        making it easy to serialize as JSON for API responses.
        """
        return {
            "id": self.id,
            "title": self.title,
            "institution": self.institution,
            "link": self.link,
            "date": self.date,
        }

    def __repr__(self):
        return f"<Certificate(title='{self.title}', institution='{self.institution}')>"
