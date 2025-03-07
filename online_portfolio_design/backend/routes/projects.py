from flask import Blueprint, request, jsonify, render_template, redirect, url_for, abort
from backend.models.projects import db, Overview, Project
import json
from backend.routes.utils import (
    truncate_html,
    get_project_id,
    is_valid_project_route,  # Function to validate project route paths
)

# Create a Blueprint for project-related routes
projects_bp = Blueprint("projects", __name__, url_prefix="/projects")

# Define the number of projects to be displayed per page in pagination
PROJECTS_PER_PAGE = 12


# ----- Projects Overview API -----
@projects_bp.route("/api/overview", methods=["GET"])
def handle_overview():
    """
    Retrieve the overview data for projects.
    Returns:
        - JSON response containing the overview data if available.
        - 404 error if no overview data is found.
    """
    overview = Overview.query.first()  # Fetch the first overview entry
    if overview:
        return jsonify(overview.to_dict())  # Convert to dictionary and return as JSON
    return jsonify({"error": "No overview data found"}), 404


# ----- Projects CRUD API -----
@projects_bp.route("/api", methods=["GET", "POST"])
def handle_projects():
    """
    Handle API requests for projects:
    - GET: Retrieve all projects from the database.
    - POST: Create a new project.

    Returns:
        - JSON response containing all projects (GET request).
        - JSON response with the newly created project (POST request).
        - 400 error if request data is invalid.
    """
    if request.method == "GET":
        projects = Project.query.all()
        return jsonify([project.to_dict() for project in projects])

    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is empty."}), 400

    try:
        # Create a new Project instance from received JSON data
        new_project = Project(
            name=data.get("name"),
            description=data.get("description"),
            github_link=data.get("github_link"),
            project_image=data.get("project_image"),
            demo_link=data.get("demo_link"),
            technical_details=json.dumps(
                data.get("technical_details")
            ),  # Store technical details as JSON
            key_learnings=data.get("key_learnings"),
            status=data.get("status"),
            demonstration=data.get("demonstration"),
        )
        db.session.add(new_project)  # Add new project to session
        db.session.commit()  # Commit changes to the database
        return (
            jsonify(new_project.to_dict()),
            201,
        )  # Return created project with 201 status
    except Exception as e:
        db.session.rollback()  # Rollback transaction if error occurs
        return jsonify({"error": f"Failed to create new project. {str(e)}"}), 400


@projects_bp.route("/api/<int:id>", methods=["GET", "DELETE", "PUT"])
def manage_project(id):
    """
    Handle API requests for a specific project by ID:
    - GET: Retrieve the project.
    - DELETE: Remove the project.
    - PUT: Update the project details.

    Returns:
        - JSON response with project data (GET request).
        - JSON success message (DELETE request).
        - JSON updated project (PUT request).
        - 400 error if request data is invalid.
    """
    project = Project.query.get_or_404(id)  # Fetch project by ID or return 404 error

    if request.method == "GET":
        return jsonify(project.to_dict())

    if request.method == "DELETE":
        try:
            db.session.delete(project)
            db.session.commit()
            return jsonify({"message": "Project entry deleted."}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Failed to delete project. {str(e)}"}), 400

    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is empty."}), 400

    try:
        # Update project details with provided data, keeping existing values if not provided
        project.name = data.get("name", project.name)
        project.description = data.get("description", project.description)
        project.github_link = data.get("github_link", project.github_link)
        project.project_image = data.get("project_image", project.project_image)
        project.demo_link = data.get("demo_link", project.demo_link)
        project.technical_details = json.dumps(
            data.get("technical_details", project.technical_details)
        )
        project.key_learnings = data.get("key_learnings", project.key_learnings)
        project.status = data.get("status", project.status)
        project.demonstration = data.get("demonstration", project.demonstration)
        db.session.commit()
        return jsonify(project.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to update project. {str(e)}"}), 400


# ----- Web Routes for Rendering Pages -----
@projects_bp.route("", methods=["GET"])
@projects_bp.route("/", methods=["GET"])
def default_projects():
    """
    Redirects to the first page of projects if no page number is specified.
    """
    return redirect(url_for("projects.projects", page_num=1))


@projects_bp.route("/page/<int:page_num>", methods=["GET"])
def projects(page_num=1):
    """
    Render the projects page with pagination.
    """
    overview = Overview.query.first()

    if overview:
        truncated_overview = truncate_html(
            json.loads(overview.overview_data)["overview_text"]
        )
        overview_dict = json.loads(overview.overview_data)
    else:
        overview_dict = {}

    # Pagination logic
    projects_paginator = Project.query.order_by(Project.id).paginate(
        page=page_num,
        per_page=PROJECTS_PER_PAGE,
        error_out=True,  # Raise 404 for invalid pages
    )

    total_projects = Project.query.count()

    return render_template(
        "/projects/projects.html",
        truncated_overview=truncated_overview,
        overview=overview_dict,
        projects=projects_paginator.items,
        projects_paginator=projects_paginator,
        is_valid_project_route=lambda path: is_valid_project_route(
            path,
            total_projects,
            PROJECTS_PER_PAGE,
            lambda project_id: get_project_id(project_id, Project),
        ),
        projects_per_page=PROJECTS_PER_PAGE,
    )


@projects_bp.route("/<int:project_id>")
def project_detail(project_id):
    """
    Render the project detail page for a specific project.
    """
    project = Project.query.get_or_404(project_id)  # Fetch project by ID or return 404
    project_data = project.to_dict()
    total_projects = Project.query.count()

    return render_template(
        "/projects/project_detail.html",
        project=project_data,
        is_valid_project_route=lambda path: is_valid_project_route(
            path,
            total_projects,
            PROJECTS_PER_PAGE,
            lambda project_id: get_project_id(project_id, Project),
        ),
        projects_per_page=PROJECTS_PER_PAGE,
    )
