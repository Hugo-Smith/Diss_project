from Backend.app import db

class Staff(db.Model):
    __tablename__ = 'staff'
    staffID = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(50))
    surname = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True)