from app import db
from sqlalchemy import DateTime

class Customer(db.Model):
    __tablename__ = 'customers'
    customer_id = db.Column(db.Integer, primary_key=True, nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    surname = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=False)
    birth_date = db.Column(DateTime, nullable=False)
    bookings = db.relationship('Booking', backref='customers', lazy=True)
    
    def __repr__(self):
        return '<Customer %r>' % self.firstName
    
    def format(self):
        return {
            'customeer_id': self.customer_id,
            'first_name': self.first_name,
            'surname': self.surname,
            'email': self.email,
            'birth_date': self.birth_date
        }