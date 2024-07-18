from flask import Flask
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy



app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://admin:admin123@localhost:5432/mydb'
db = SQLAlchemy(app)

from models.booking import Booking
from models.customer import Customer
from models.staff import Staff

if __name__ == '__main__':
    app.run(debug=True)

