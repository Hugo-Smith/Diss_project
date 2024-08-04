from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, JWTManager, get_jwt_identity, verify_jwt_in_request, get_jwt
from functools import wraps


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://admin:admin123@localhost:5432/dissdb'
app.config['JWT_SECRET_KEY'] = 'seals_are_cool'

db = SQLAlchemy(app)
CORS(app)
migrate = Migrate(app,db)
bcrypt = Bcrypt(app) # for password hashing
jwt = JWTManager(app)

from models.booking import Booking
from models.customer import Customer
from models.staff import Staff
from models.treatment import Treatment



@app.route("/")
def index():
    return 'Welcome to Diss REST API Server'

"""
Custome decorator to check staff authentication
"""

def staff_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get('is_staff'):
                return fn(*args, **kwargs)
            else:
                return jsonify({'success': False, 'message': 'Staff access required'}), 403
        return decorator
    return wrapper


from routes.customer_routes import *
from routes.treatment_routes import *
from routes.booking_routes import *
from routes.staff_routes import *

"""
Authentication routes
* login
* admin login
* verify token
* verify staff token
* logout
"""
@app.route('/api/v1/login', methods=['POST'])
def login():
    email = request.get_json().get('email', None)
    password = request.get_json().get('password', None)

    if email is None or password is None:
        return jsonify({'success': False, 'message': 'Missing email or password'}), 400
    
    customer = Customer.query.filter_by(email=email).first()

    if customer is None or not bcrypt.check_password_hash(customer.password, password):
        return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
    
    access_token = create_access_token(identity=customer.customer_id)

    return jsonify({'success': True,'access_token' : access_token}), 200


@app.route('/api/v1/staff-login', methods=['POST'])
def staffLogin():
    email = request.get_json().get('email', None)
    password = request.get_json().get('password', None)

    if email is None or password is None:
        return jsonify({'success': False, 'message': 'Missing email or password'}), 400
    
    staff_member = Staff.query.filter_by(email=email).first()

    if staff_member is None or not bcrypt.check_password_hash(staff_member.password, password):
        return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
    
    #adds additional layer of authentication onto token
    additional_claims = {'is_staff': True}
    
    access_token = create_access_token(identity=staff_member.email, additional_claims=additional_claims)
    return jsonify({'success': True, 'access_token': access_token}), 200


@app.route('/api/v1/verify-token', methods=['POST'])
@jwt_required()
def verifyTokenAuth():
    current_user = get_jwt_identity()

    if current_user == None:
        return jsonify({'success' : False, 'message' : 'Token cannot be verified'}), 401
 
    return jsonify({'user': current_user}), 200

@app.route('/api/v1/verify-staff-token', methods=['POST'])
@jwt_required()
@staff_required()
def verifyStaffToken():
    current_user = get_jwt_identity()

    if current_user == None:
        return jsonify({'success' : False, 'message' : 'Token cannot be verified'}), 401
 
    return jsonify({'success': True,
                    'user': current_user}), 200


@app.route('/api/v1/logout', methods=['POST'])
def logout():
    response = jsonify({'message' : 'Logged out successfully'}), 200
    
    return response


if __name__ == '__main__':
    app.run(debug=True)

