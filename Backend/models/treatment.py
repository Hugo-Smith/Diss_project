from app import db
from sqlalchemy.dialects.postgresql import NUMERIC

class Treatment(db.Model):
    __tablename__ = 'treatments'
    treatment_id = db.Column(db.Integer, primary_key=True, nullable=False)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(250), nullable=False)
    price = db.Column(NUMERIC(precision=6,scale=2), nullable=False)
    is_available = db.Column(db.Boolean, default=False)

    def format(self):
        return {
            'treatment_id' : self.treatment_id,
            'title': self.title,
            'description' : self.description,
            'price' : self.price,
            'is_available' : self.is_available
            }