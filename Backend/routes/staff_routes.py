"""
Staff routes
* retrieve all staff
* retrieve all available staff
* add staff / staff signup
* delete staff
"""
from app import app, bcrypt, db, staff_required
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from models.staff import Staff

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
        return jsonify(message='No staff records found.'), 404

@app.route('/api/v1/available-staff', methods=['GET'])
def retrieve_available_staff():
    if request.method == 'GET':
        available_staff = Staff.query.filter_by(is_active=True)
        if available_staff:
            return jsonify({
                'success': True,
                'staff' : [staff.format() for staff in available_staff]
            }) , 200
        return jsonify(message='No staff records found.'), 404


@app.route('/api/v1/staff-signup', methods=['POST'])
@jwt_required()
@staff_required()
def add_staff():
    if request.method =='POST':
        
        staff_identity = get_jwt_identity()
        print(staff_identity)

        staff_member = Staff.query.filter_by(email=staff_identity).first()

        if staff_member == None:
            return jsonify({
                'success': False, 
                'message': 'Token cannot be verified'
                }), 401
        
        
       
        first_name = request.get_json().get('first_name')
        surname = request.get_json().get('surname')
        email = request.get_json().get('email')
        password = request.get_json().get('password')
        is_active = request.get_json().get('is_active', False) #defaults to false

        if first_name and surname and email and password:
            staff_query = Staff.query.filter_by(email=email).first()
            if staff_query:
                return jsonify({'success': False, 'message': 'Email is already registered'}), 409
            else:
                password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

                new_staff = Staff(
                    first_name = first_name,
                    surname = surname,
                    email = email,
                    password = password_hash,
                    is_active = is_active
                )
                db.session.add(new_staff)
                db.session.commit()
                return({
                    'success': True,
                    'new_staff': new_staff.format()
                }), 201
            
@app.route('/api/v1/delete-staff/<string:email>', methods=['DELETE'])
@jwt_required()
def delete_staff(email):

    current_user_email = get_jwt_identity()
    if current_user_email == None:
        return jsonify({'success' : False, 'message' : 'Token cannot be verified'}), 401

    staff = Staff.query.filter_by(email=email).first()

    if staff is None:
        return jsonify({'success': False, 'message': 'Staff member not found'}), 404
    
    isStaff = Staff.query.filter_by(email=current_user_email)

    if staff.email == current_user_email or isStaff:
        try:
                db.session.delete(staff)
                db.session.commit()
        except Exception:
            db.session.rollback()
            return jsonify({'success': False, 'message': 'Error while deleting booking'}), 500
        return jsonify({'message': 'Staff account deleted successfully'}), 200
    else:
        return jsonify({'success': False, 'message': 'Unauthorised'}), 403