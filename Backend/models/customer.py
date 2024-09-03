from app import db

class Customer(db.Model):
    __tablename__ = 'customers'
    customer_id = db.Column(db.Integer, primary_key=True, nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    surname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=False)
    
    def format(self):
        return {
            'customer_id': self.customer_id,
            'first_name': self.first_name,
            'surname': self.surname,
            'email': self.email,
        }
    


