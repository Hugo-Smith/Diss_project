from Backend.app import db

class Customer(db.Model):
    __tablename__ = 'customers'
    customerID = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(50))
    surname = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True)
    DOB = db.Column(db.Date)
    
    bookings = db.relationship('Booking', backref='customer', lazy=True)