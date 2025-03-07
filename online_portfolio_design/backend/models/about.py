from backend.models import db  # Import the shared db instance
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship


# ----------------------------------------------
# Technical Skill Models
# ----------------------------------------------
class TechnicalSkillCategory(db.Model):
    """
    Represents a category for technical skills (e.g., Programming Languages, Frameworks, etc.).

    This model defines the structure for storing categories of technical skills in the database.
    Each category can have multiple skills associated with it (one-to-many relationship).
    """

    __tablename__ = (
        "technical_skill_category"  # Optional: Explicitly set the table name
    )

    id = Column(Integer, primary_key=True)
    name = Column(
        String(100), nullable=False, unique=True
    )  # Unique category name: enforces that each category has a unique name.
    skills = relationship(
        "TechnicalSkill", backref="category", lazy=True
    )  # One-to-many relationship:  Establishes a relationship with the TechnicalSkill model.
    #   - backref="category": Creates a 'category' attribute on the TechnicalSkill model,
    #     allowing you to access the category from a skill instance.
    #   - lazy=True:  Specifies that the skills will be loaded only when accessed
    #     (lazy loading), which can improve performance.

    def __repr__(self):
        return f"<TechnicalSkillCategory(name='{self.name}')>"


class TechnicalSkill(db.Model):
    """
    Represents an individual technical skill belonging to a category.

    This model defines the structure for storing individual technical skills in the database.
    Each skill belongs to a specific category (one-to-many relationship from category to skill).
    """

    __tablename__ = "technical_skill"  # Optional: Explicitly set the table name

    id = Column(Integer, primary_key=True)
    name = Column(
        String(100), nullable=False
    )  # Skill name: The name of the technical skill.
    level = Column(
        String(50), nullable=True
    )  # Proficiency level (e.g., Expert, Proficient, Beginner): Describes the skill level.
    progress = Column(
        Integer, nullable=True
    )  # Progress percentage for UI visualization: Used to represent the skill level visually in a UI.
    category_id = Column(
        Integer, ForeignKey("technical_skill_category.id"), nullable=False
    )  # Foreign key reference: Links the skill to its category in the TechnicalSkillCategory table.
    #   - ForeignKey("technical_skill_category.id"): Specifies the foreign key relationship
    #     with the 'id' column of the 'technical_skill_category' table.

    def __repr__(self):
        return f"<TechnicalSkill(name='{self.name}', level='{self.level}')>"
