from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from feedback.db.session import Base


class CareerTemplate(Base):
    __tablename__ = "career_template"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)

    template = Column(JSON, nullable=False)

    created_by_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    created_by_user = relationship("User", foreign_keys=[created_by_id])
    created_at = Column(DateTime, server_default=func.now())
