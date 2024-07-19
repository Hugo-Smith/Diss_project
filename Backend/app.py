from flask import Flask
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://admin:admin123@localhost:5432/dissdb'
db = SQLAlchemy(app)
migrate = Migrate(app,db)

from models.booking import Booking
from models.customer import Customer
from models.staff import Staff

@app.route("/")
def index():
    return 'Welcome to Diss REST API Server'

if __name__ == '__main__':
    app.run(debug=True)

