import pytest
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import app, db
from flask import json
from flask_jwt_extended import create_access_token
from models.booking import Booking
from models.staff import Staff
from models.treatment import Treatment
from models.customer import Customer

@pytest.fixture()
def test_client():
    app.config['TESTING'] = True


    with app.test_client() as testing_client:
        with app.app_context():
            db.create_all()


            staff1 = Staff(staff_id=1,
                           first_name="John", 
                           surname="Doe", 
                           email="admin@gmail.com",
                           password='x')
            
            
            customer1 = Customer(customer_id=1, 
                                 first_name="Jane", 
                                 surname="Smith", 
                                 email='js@gmail.com',
                                 password='x')
            
            treatment1 = Treatment(treatment_id=1, 
                                   title="Test trim",
                                   description='x',
                                   price=9.99)
            
            db.session.add(staff1)
            db.session.add(customer1)
            db.session.add(treatment1)
            db.session.commit()

            booking1 = Booking(customer_id=1, 
                               treatment_id=1, 
                               staff_id=1, 
                               date='2024-08-10', 
                               note="Test note")
            
            db.session.add(booking1)
            db.session.commit()

        with app.test_client() as client:
            yield client

        # Tear down
        with app.app_context():
            db.drop_all()


def test_retrieve_all_bookings(test_client):
    response = test_client.get('/api/v1/bookings')
    data = json.loads(response.data)

    assert response.status_code == 200
    assert data['success'] is True
    assert len(data['bookings']) == 1

def test_retrieve_booking_by_date(test_client):
    response = test_client.get('/api/v1/bookings/2024-08-10')
    data = json.loads(response.data)

    assert response.status_code == 200
    assert data['success'] is True
    assert len(data['bookings']) == 1

def test_retrieve_booking_by_id(test_client):
    response = test_client.get('/api/v1/booking/1')
    data = json.loads(response.data)

    assert response.status_code == 200
    assert data['success'] is True
    assert data['booking']['booking_id'] == 1

def test_retrieve_booking_by_customer_id(test_client):
    response = test_client.get('/api/v1/bookings/1')
    data = json.loads(response.data)

    assert response.status_code == 200
    assert data['success'] is True
    assert len(data['bookings']) == 1

def test_add_booking(test_client):
    with app.app_context():
        token = create_access_token(identity=1)

    headers = {
        'Authorization': f'Bearer {token}'
    }

    response = test_client.post('/api/v1/add-booking', headers=headers, json={
        'treatment_id': 1,
        'staff_id': 1,
        'date': '2024-08-11',
        'note': 'Test booking'
    })
    data = json.loads(response.data)

    assert response.status_code == 201
    assert data['success'] is True
    assert data['new_treatment']['note'] == 'Test booking'

def test_delete_booking(test_client):
    with app.app_context():
        token = create_access_token(identity=1)

    headers = {
        'Authorization': f'Bearer {token}'
    }

    response = test_client.delete('/api/v1/delete-booking/1', headers=headers)
    data = json.loads(response.data)

    assert response.status_code == 200
    assert data['message'] == 'Booking deleted successfully'
