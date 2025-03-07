from flask import Blueprint, request, jsonify, render_template
from backend.models.career import db, Experience, Education, Certificate
from backend.routes.utils import (
    parse_date,
)  # Function to parse date strings for sorting
from typing import List  # Import for type hinting

career_bp = Blueprint("career", __name__, url_prefix="/career")
# Blueprint for career-related routes, prefixed with "/career"


# ------------------------ EXPERIENCE API ------------------------ #
@career_bp.route("/api/experience", methods=["GET", "POST"])
def handle_experience():
    """Handles GET and POST requests for work experience entries."""

    if request.method == "GET":
        """Retrieves all work experience entries."""
        experiences: List[Experience] = Experience.query.all()
        # Query all Experience objects from the database
        return jsonify([exp.to_dict() for exp in experiences]), 200
        # Return a JSON response with all experiences, converted to dictionaries, and a 200 OK status

    data = request.get_json()
    # Get data from the request body as JSON
    if not data:
        # If the request body is empty
        return jsonify({"error": "Request body is empty."}), 400
        # Return an error message and a 400 Bad Request status

    try:
        new_experience = Experience(
            image=data.get("image"),
            title=data.get("title"),
            company=data.get("company"),
            duration=data.get("duration"),
            points=data.get("points"),
            skills=data.get("skills"),
        )
        # Create a new Experience object from the data
        db.session.add(new_experience)
        # Add the new experience to the database session
        db.session.commit()
        # Commit the changes to the database
        return jsonify(new_experience.to_dict()), 201
        # Return the new experience as JSON and a 201 Created status
    except Exception as e:
        # If an error occurs during the process
        db.session.rollback()
        # Rollback the database session to revert any changes
        return jsonify({"error": f"Failed to create experience: {str(e)}"}), 500
        # Return an error message and a 500 Internal Server Error status


@career_bp.route("/api/experience/<int:id>", methods=["DELETE", "PUT"])
def manage_experience(id):
    """Handles DELETE and PUT requests for a specific work experience entry."""

    experience = Experience.query.get_or_404(id)
    # Get the Experience object with the given ID, or return a 404 error if not found

    if request.method == "DELETE":
        """Deletes a specific work experience entry."""
        try:
            db.session.delete(experience)
            # Delete the experience from the database session
            db.session.commit()
            # Commit the changes to the database
            return jsonify({"message": "Experience entry deleted."}), 200
            # Return a success message and a 200 OK status
        except Exception as e:
            # If an error occurs during the process
            db.session.rollback()
            # Rollback the database session to revert any changes
            return jsonify({"error": f"Failed to delete experience: {str(e)}"}), 500
            # Return an error message and a 500 Internal Server Error status

    data = request.get_json()
    # Get data from the request body as JSON
    if not data:
        # If the request body is empty
        return jsonify({"error": "Request body is empty."}), 400
        # Return an error message and a 400 Bad Request status

    try:
        """Updates a specific work experience entry."""
        experience.image = data.get("image", experience.image)
        # Update the image, or keep the existing image if not provided
        experience.title = data.get("title", experience.title)
        # Update the title, or keep the existing title if not provided
        experience.company = data.get("company", experience.company)
        # Update the company, or keep the existing company if not provided
        experience.duration = data.get("duration", experience.duration)
        # Update the duration, or keep the existing duration if not provided
        experience.points = data.get("points", experience.points)
        # Update the points, or keep the existing points if not provided
        experience.skills = data.get("skills", experience.skills)
        # Update the skills, or keep the existing skills if not provided
        db.session.commit()
        # Commit the changes to the database
        return jsonify(experience.to_dict()), 200
        # Return the updated experience as JSON and a 200 OK status
    except Exception as e:
        # If an error occurs during the process
        db.session.rollback()
        # Rollback the database session to revert any changes
        return jsonify({"error": f"Failed to update experience: {str(e)}"}), 500
        # Return an error message and a 500 Internal Server Error status


# ------------------------ EDUCATION API ------------------------ #
@career_bp.route("/api/education", methods=["GET", "POST"])
def handle_education():
    """Handles GET and POST requests for education entries."""

    if request.method == "GET":
        """Retrieves all education entries."""
        educations: List[Education] = Education.query.all()
        # Query all Education objects from the database
        return jsonify([edu.to_dict() for edu in educations]), 200
        # Return a JSON response with all educations, converted to dictionaries, and a 200 OK status

    data = request.get_json()
    # Get data from the request body as JSON
    if not data:
        # If the request body is empty
        return jsonify({"error": "Request body is empty."}), 400
        # Return an error message and a 400 Bad Request status

    try:
        new_education = Education(
            degree=data.get("degree"),
            institution=data.get("institution"),
            year=data.get("year"),
            additional_information=data.get("additional_information"),
        )
        # Create a new Education object from the data
        db.session.add(new_education)
        # Add the new education to the database session
        db.session.commit()
        # Commit the changes to the database
        return jsonify(new_education.to_dict()), 201
        # Return the new education as JSON and a 201 Created status
    except Exception as e:
        # If an error occurs during the process
        db.session.rollback()
        # Rollback the database session to revert any changes
        return jsonify({"error": f"Failed to create education: {str(e)}"}), 500
        # Return an error message and a 500 Internal Server Error status


@career_bp.route("/api/education/<int:id>", methods=["DELETE", "PUT"])
def manage_education(id):
    """Handles DELETE and PUT requests for a specific education entry."""

    education = Education.query.get_or_404(id)
    # Get the Education object with the given ID, or return a 404 error if not found

    if request.method == "DELETE":
        """Deletes a specific education entry."""
        try:
            db.session.delete(education)
            # Delete the education from the database session
            db.session.commit()
            # Commit the changes to the database
            return jsonify({"message": "Education entry deleted."}), 200
            # Return a success message and a 200 OK status
        except Exception as e:
            # If an error occurs during the process
            db.session.rollback()
            # Rollback the database session to revert any changes
            return jsonify({"error": f"Failed to delete education: {str(e)}"}), 500
            # Return an error message and a 500 Internal Server Error status

    data = request.get_json()
    # Get data from the request body as JSON
    if not data:
        # If the request body is empty
        return jsonify({"error": "Request body is empty."}), 400
        # Return an error message and a 400 Bad Request status

    try:
        """Updates a specific education entry."""
        education.degree = data.get("degree", education.degree)
        # Update the degree, or keep the existing degree if not provided
        education.institution = data.get("institution", education.institution)
        # Update the institution, or keep the existing institution if not provided
        education.year = data.get("year", education.year)
        # Update the year, or keep the existing year if not provided
        education.additional_information = data.get(
            "additional_information", education.additional_information
        )
        # Update the additional_information, or keep the existing additional_information if not provided
        db.session.commit()
        # Commit the changes to the database
        return jsonify(education.to_dict()), 200
        # Return the updated education as JSON and a 200 OK status
    except Exception as e:
        # If an error occurs during the process
        db.session.rollback()
        # Rollback the database session to revert any changes
        return jsonify({"error": f"Failed to update education: {str(e)}"}), 500
        # Return an error message and a 500 Internal Server Error status


# ------------------------ CERTIFICATE API ------------------------ #
@career_bp.route("/api/certificates", methods=["GET", "POST"])
def handle_certificate():
    """Handles GET and POST requests for certificate entries."""

    if request.method == "GET":
        """Retrieves all certificate entries."""
        certificates: List[Certificate] = Certificate.query.all()
        # Query all Certificate objects from the database
        return jsonify([cert.to_dict() for cert in certificates]), 200
        # Return a JSON response with all certificates, converted to dictionaries, and a 200 OK status

    data = request.get_json()
    # Get data from the request body as JSON
    if not data:
        # If the request body is empty
        return jsonify({"error": "Request body is empty."}), 400
        # Return an error message and a 400 Bad Request status

    try:
        new_certificate = Certificate(
            title=data.get("title"),
            institution=data.get("institution"),
            link=data.get("link"),
            date=data.get("date"),
        )
        # Create a new Certificate object from the data
        db.session.add(new_certificate)
        # Add the new certificate to the database session
        db.session.commit()
        # Commit the changes to the database
        return jsonify(new_certificate.to_dict()), 201
        # Return the new certificate as JSON and a 201 Created status
    except Exception as e:
        # If an error occurs during the process
        db.session.rollback()
        # Rollback the database session to revert any changes
        return jsonify({"error": f"Failed to create certificate: {str(e)}"}), 500
        # Return an error message and a 500 Internal Server Error status


@career_bp.route("/api/certificates/<int:id>", methods=["DELETE", "PUT"])
def manage_certificate(id):
    """Handles DELETE and PUT requests for a specific certificate entry."""

    certificate = Certificate.query.get_or_404(id)
    # Get the Certificate object with the given ID, or return a 404 error if not found

    if request.method == "DELETE":
        """Deletes a specific certificate entry."""
        try:
            db.session.delete(certificate)
            # Delete the certificate from the database session
            db.session.commit()
            # Commit the changes to the database
            return jsonify({"message": "Certificate entry deleted."}), 200
            # Return a success message and a 200 OK status
        except Exception as e:
            # If an error occurs during the process
            db.session.rollback()
            # Rollback the database session to revert any changes
            return jsonify({"error": f"Failed to delete certificate: {str(e)}"}), 500
            # Return an error message and a 500 Internal Server Error status

    data = request.get_json()
    # Get data from the request body as JSON
    if not data:
        # If the request body is empty
        return jsonify({"error": "Request body is empty."}), 400
        # Return an error message and a 400 Bad Request status

    try:
        """Updates a specific certificate entry."""
        certificate.title = data.get("title", certificate.title)
        # Update the title, or keep the existing title if not provided
        certificate.institution = data.get("institution", certificate.institution)
        # Update the institution, or keep the existing institution if not provided
        certificate.link = data.get("link", certificate.link)
        # Update the link, or keep the existing link if not provided
        certificate.date = data.get("date", certificate.date)
        # Update the date, or keep the existing date if not provided
        db.session.commit()
        # Commit the changes to the database
        return jsonify(certificate.to_dict()), 200
        # Return the updated certificate as JSON and a 200 OK status
    except Exception as e:
        # If an error occurs during the process
        db.session.rollback()
        # Rollback the database session to revert any changes
        return jsonify({"error": f"Failed to update certificate: {str(e)}"}), 500
        # Return an error message and a 500 Internal Server Error status


# ------------------------ CAREER PAGE ROUTE ------------------------ #
@career_bp.route("")
def career():
    """Renders the career page with work experience, education, and certificate data."""

    experiences: List[Experience] = Experience.query.all()
    # Query all Experience objects from the database
    educations: List[Education] = Education.query.all()
    # Query all Education objects from the database
    certifications: List[Certificate] = Certificate.query.all()
    # Query all Certificate objects from the database

    sorted_certificates: List[Certificate] = sorted(
        certifications, key=lambda cert: parse_date(cert.date), reverse=True
    )
    # Sort the certificates by date in descending order
    # The function that is sorting the list, use the parse_date function for the work.

    return render_template(
        "career.html",
        experiences=[exp.to_dict() for exp in experiences],
        # Pass the work experiences to the template
        educations=[edu.to_dict() for edu in educations],
        # Pass the education history to the template
        certificates=[cert.to_dict() for cert in sorted_certificates],
        # Pass the certificates to the template
    )
    # Render the 'career.html' template with the retrieved data
