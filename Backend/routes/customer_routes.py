"""
Customer routes
* retrieve all customers
* customer signup/ add customer
* retrieve customer details and bookings
* customer search by names
* delete customer
* password confirmation - pre-account delete
"""
from app import app, db, bcrypt, staff_required
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_

from models.customer import Customer
from models.staff import Staff
from models.treatment import Treatment
from models.booking import Booking

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
                return jsonify({'success': False, 'message': 'Email is already registered'}), 409
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


@app.route('/api/v1/customer-details', methods=['GET'])
@jwt_required()
def retrieve_customer_details():
    if request.method == 'GET':
        current_user_id = get_jwt_identity()

        if current_user_id == None:
            return jsonify({'success' : False, 'message' : 'Token cannot be verified'}), 401
        
        query = db.session.query(Booking.booking_id, Booking.note, Booking.date, Staff.first_name, Staff.surname, Treatment.title).\
            join(Staff, Booking.staff_id == Staff.staff_id).\
            join(Treatment, Booking.treatment_id == Treatment.treatment_id).\
            filter(Booking.customer_id == current_user_id).all()
        
        bookings = [{'booking_id': row.booking_id,
                     'date' : row.date,
                     'first_name': row.first_name, 
                     'surname': row.surname,
                     'title': row.title,
                     'note': row.note} for row in query]

        customer = Customer.query.filter_by(customer_id=current_user_id).first()

        if current_user_id:
            return jsonify({
                'success' : True,
                'customer' : customer.format(),
                'bookings' : bookings
            }), 200
        return jsonify(message='No records found'), 404


@app.route('/api/v1/customer-search/<string:first_name><string:surname>', methods=['GET'])
@jwt_required()
@staff_required()
def retrieve_customers_by_name(first_name, surname):
    if request.method == 'GET':

        #Searches for names similar to firstname OR surname
        customer_query = Customer.query.filter(
            or_(
                Customer.first_name.ilike(f"%{first_name}%"), 
                Customer.surname.ilike(f"%{surname}%")
                )
                ).all()

        if customer_query:
            customers = [{'customer_id': row.customer_id,
                        'first_name': row.first_name,
                        'surname': row.surname,
                        'email': row.email} for row in customer_query]
            
            return jsonify({
                'success': True,
                'customers': customers
            }), 200
        
        return jsonify({ 'success': False,
                        'message': 'No customer records that match'}), 404
    
@app.route('/api/v1/delete-customer/<int:customer_id>', methods=['DELETE'])
@jwt_required()
def delete_customer(customer_id):

    current_user_id = get_jwt_identity()
    if current_user_id == None:
        return jsonify({'success' : False, 'message' : 'Token cannot be verified'}), 401

    customer = Customer.query.filter_by(customer_id=customer_id).first()

    if customer is None:
        return jsonify({'success': False, 'message': 'Booking not found'}), 404
    
    isStaff = Staff.query.filter_by(email=current_user_id)

    if customer.customer_id == current_user_id or isStaff:
        try:
                db.session.delete(customer)
                db.session.commit()
        except Exception:
            db.session.rollback()
            return jsonify({'success': False, 'message': 'Error while deleting booking'}), 500
        return jsonify({'message': 'Customer account deleted successfully'}), 200
    else:
        return jsonify({'success': False, 'message': 'Unauthorised'}), 403

@app.route('/api/v1/confirm-password/', methods=['POST'])
@jwt_required()
def confirm_password():

    current_user_id = get_jwt_identity()
    if current_user_id == None:
        return jsonify({'success' : False, 'message' : 'Token cannot be verified'}), 401
    
    password =  request.get_json().get('password')
    customer = Customer.query.filter_by(customer_id=current_user_id)

    if password is None:
        return jsonify({'success': False, 'message': 'Missing password'}), 400

    if not bcrypt.check_password_hash(customer.password, password):
        return jsonify({'success': False, 'message': 'Invalid password'}), 401
    
    return jsonify({'success': True, 'message': 'Password confirmed'}), 200