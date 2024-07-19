from app import db

class Staff(db.Model):
    __tablename__ = 'staff'
    staffID = db.Column(db.Integer, primary_key=True, nullable=False)
    firstName = db.Column(db.String(50), nullable=False)
    surname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    is_active = db.Column(db.Boolean, default=False)