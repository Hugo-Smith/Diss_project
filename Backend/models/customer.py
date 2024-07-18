from app import db
from sqlalchemy import DateTime

class Customer(db.Model):
    __tablename__ = 'customers'
    customerID = db.Column(db.Integer, primary_key=True, nullable=False)
    firstName = db.Column(db.String(50), nullable=False)
    surname = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=False)
    DOB = db.Column(DateTime, nullable=False)
    
    bookings = db.relationship('Booking', backref='customers', lazy=True)
    
    def __repr__(self):
        return '<Customer %r>' % self.firstName