from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://admin:admin123@localhost:5432/dissdb'
db = SQLAlchemy(app)
CORS(app)
migrate = Migrate(app,db)
bcrypt = Bcrypt(app) # for password hashing

from models.booking import Booking
from models.customer import Customer
from models.staff import Staff

@app.route("/")
def index():
    return 'Welcome to Diss REST API Server'

# retrieve all staff endpoint
@app.route("/api/v1/staff", methods=['GET'])
def retrieve_staff():
    if request.method == 'GET':
        all_staff = Staff.query.all()
        if all_staff:
            return jsonify({
                'success' : True,
                'staff' : [staff.format() for staff in all_staff]
            }) , 200
        return jsonify(message='No staff records found'), 404


#retrieve all customers endpoint
@app.route("/api/v1/customers", methods=['GET'])
def retrieve_customers():
    if request.method == 'GET':
        all_customers = Customer.query.all()
        if all_customers:
            return jsonify({
                'success' : True,
                'customers' : [customer.format() for customer in all_customers]
            }) , 200
        return jsonify(message='No customer records found'), 404


@app.route('/api/v1/customer-signup', methods=['POST'])
def add_customer():
    if request.method == 'POST':
        first_name = request.get_json().get('first_name')
        surname = request.get_json().get('surname')
        email = request.get_json().get('email')
        password = request.get_json().get('password')

        if first_name and surname and email and password :
            all_customers = Customer.query.filter_by(email=email).first()
            if all_customers:
                return jsonify(message="Email address already exists."), 409
            else:
                password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

                new_customer = Customer(
                    first_name = first_name,
                    surname = surname,
                    email = email,
                    password = password_hash,
                )
                db.session.add(new_customer)
                db.session.commit()
                return jsonify({
                    'success' : True,
                    'new_customer' : new_customer.format()
                }), 201
        else:
            return jsonify({'error': 'Invalid input'}), 400
                

if __name__ == '__main__':
    app.run(debug=True)

