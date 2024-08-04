"""
Booking routes 
* retrieve all bookings
* retrieve booking for a certain date
* retrieve booking with booking id
* retrieve bookings with customer id
* add booking
* delete booking
"""
from app import app, db
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models.booking import Booking
from models.staff import Staff
from models.treatment import Treatment

@app.route('/api/v1/bookings', methods=['GET'])
def retrive_bookings():
    if request.method == 'GET':
        all_bookings = Booking.query.all()
        if all_bookings:
            return jsonify({
                'success' : True,
                'bookings' : [booking.format() for booking in all_bookings]
            }), 200
        return jsonify(message='No bookings found'), 404

@app.route('/api/v1/bookings/date', methods=['GET'])
def get_bookings_by_date():
    if request.method == 'GET':
        date = request.args.get('date')
        if date is None:
            return jsonify({'error': 'Date is required'}), 400
        
        query = db.session.query(Booking.date, Staff.first_name, Staff.surname).\
            join(Staff, Booking.staff_id == Staff.staff_id).\
            filter_by(date = date)
        
        bookings = [{'date' : row.date,
                     'first_name': row.first_name, 
                     'surname': row.surname} for row in query]
        
        if bookings:
            return jsonify({
                'success': True,
                'bookings': bookings
            }), 200
        return jsonify({
            'success': False,
            'message': 'No bookings found'}), 404
    
@app.route('/api/v1/booking/<int:booking_id>', methods=['GET'])
def retrieve_booking_by_id(booking_id):
    if request.method == 'GET':

        booking = Booking.query.filter_by(booking_id=booking_id).first()

        if booking:
            return jsonify({
                'success': True,
                'booking': booking.format()
            }), 200
        return jsonify({
            'success': False,
            'message': 'No booking found'})
    
@app.route('/api/v1/bookings/<int:customer_id>', methods=['GET'])
def retrieve_booking_by_customer(customer_id):
    if request.method== 'GET':

         query = db.session.query(Booking.booking_id, Booking.note, Booking.date, Staff.first_name, Staff.surname, Treatment.title).\
            join(Staff, Booking.staff_id == Staff.staff_id).\
            join(Treatment, Booking.treatment_id == Treatment.treatment_id).\
            filter(Booking.customer_id == customer_id).all()
         
         bookings = [{'booking_id': row.booking_id,
                     'date' : row.date,
                     'first_name': row.first_name, 
                     'surname': row.surname,
                     'title': row.title,
                     'note': row.note} for row in query]
         
         if bookings:
             return jsonify({
                 'success': True,
                 'bookings': bookings
             }), 200
         return jsonify({
             'success': False,
             'message': 'No bookings found'
         }), 404

@app.route('/api/v1/add-booking', methods=['POST'])
@jwt_required()
def add_booking():
    if request.method == 'POST':
        current_user = get_jwt_identity()

        if current_user == None:
            return jsonify({'success' : False, 'message' : 'Token cannot be verified'}), 401
        
        customer_id = current_user
        treatment_id = request.get_json().get('treatment_id')
        staff_id = request.get_json().get('staff_id')
        date = request.get_json().get('date')
        note = request.get_json().get('note', '')

        if treatment_id == None:
            note += ' (No treatment was selected)'

        if customer_id and staff_id and date:

            new_booking = Booking(
                customer_id = customer_id,
                treatment_id = treatment_id,
                staff_id = staff_id,
                date = date,
                note = note
            )        
            db.session.add(new_booking)
            db.session.commit()
            return jsonify({
                'success' : True,
                'new_treatment' : new_booking.format()
            }), 201
        else:
            return jsonify({'error': 'Invalid input values'}), 400

@app.route('/api/v1/delete-booking/<int:booking_id>', methods=['DELETE'])
@jwt_required()
def delete_booking(booking_id):

    current_user_id = get_jwt_identity()
    if current_user_id == None:
        return jsonify({'success' : False, 'message' : 'Token cannot be verified'}), 401

    booking = Booking.query.filter_by(booking_id=booking_id).first()

    if booking is None:
        return jsonify({'success': False, 'message': 'Booking not found'}), 404
    
    isStaff = Staff.query.filter_by(email=current_user_id)

    if booking.customer_id == current_user_id or isStaff:
        try:
                db.session.delete(booking)
                db.session.commit()
        except Exception:
            db.session.rollback()
            return jsonify({'success': False, 'message': 'Error while deleting booking'}), 500
        return jsonify({'message': 'Booking deleted successfully'}), 200
    else:
        return jsonify({'success': False, 'message': 'Unauthorised'}), 403
