from app import db

class Staff(db.Model):
    __tablename__ = 'staff'
    staff_id = db.Column(db.Integer, primary_key=True, nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    surname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    is_active = db.Column(db.Boolean, default=False)

    def format(self):
        return {
            'staff_id': self.staff_id,
            'first_name': self.first_name,
            'surname': self.surname,
            'email': self.email,
            'is_active':self.is_active
        }