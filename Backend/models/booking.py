from Backend.app import db

class Booking(db.Model):
    __tablename__ = 'booking'
    bookingID = db.Column(db.Integer, primary_key=True)
    customerID = db.Column(db.Integer, db.ForeignKey('customer.customerID'), nullable=False)
    date = db.Column(db.Date)
    treatment = db.Column(db.String(100))
    note = db.Column(db.Text)