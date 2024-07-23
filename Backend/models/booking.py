from app import db

class Booking(db.Model):
    __tablename__ = 'bookings'
    booking_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'), nullable=False)
    date = db.Column(db.Date)
    treatment = db.Column(db.String(200))
    note = db.Column(db.Text)