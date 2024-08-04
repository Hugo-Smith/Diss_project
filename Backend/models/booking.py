from app import db

class Booking(db.Model):
    __tablename__ = 'bookings'
    booking_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'), nullable=False)
    treatment_id = db.Column(db.Integer, db.ForeignKey('treatments.treatment_id'), nullable=True)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.staff_id'), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    note = db.Column(db.Text)

    def format(self):
        return {
            'booking_id' : self.booking_id,
            'customer_id' : self.customer_id,
            'treatment_id' : self.treatment_id,
            'staff_id' : self.staff_id,
            'date' : self.date,
            'note' : self.note
        }