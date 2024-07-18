from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from models.booking import Booking
from models.customer import Customer
from models.staff import Staff


app = Flask(__name__, template_folder='templates')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydb.db'
db = SQLAlchemy(app)

