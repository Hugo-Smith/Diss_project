
import pytest
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, db, bcrypt
from flask_jwt_extended import decode_token, create_access_token
from models.customer import Customer
from models.staff import Staff

@pytest.fixture
def client():
    app.config['TESTING'] = True
    
    with app.app_context():
        db.create_all() 
        customer = Customer(
            first_name='John',
            surname='Doe',
            email='test@gmail.com',
            password=bcrypt.generate_password_hash('password').decode('utf-8'))

        customer2 = Customer(
            first_name='Jane',
            surname='Smith',
            email='test2@gmail.com',
            password=bcrypt.generate_password_hash('password').decode('utf-8'))

        staff = Staff(
            first_name='Mary',
            surname='jones',
            email='staff@gmail.com',
            password=bcrypt.generate_password_hash('password').decode('utf-8'))
        db.session.add(customer)
        db.session.add(customer2)
        db.session.add(staff)
        db.session.commit()

    with app.test_client() as client:
        yield client

    # Tear down
    with app.app_context():
        db.drop_all()

def test_retrieve_customers_success(client):
    response = client.get('/api/v1/customers')
    data = response.get_json()

    assert response.status_code == 200
    assert response.is_json

    data = response.get_json()
    assert data['success'] is True
    assert len(data['customers']) == 2


def test_add_customer_success(client):
    response = client.post('/api/v1/customer-signup',
                           json={
                               'first_name':'john',
                               'surname': 'surname',
                               'email':'test3@gmail.com',
                               'password':'password'})
    assert response.status_code == 201
    assert response.is_json

    data = response.get_json()
    assert data['success'] is True
    customer_data = data['new_customer']['email'] == 'test3@gmail.com'
 

def test_retrieve_customer_details(client):
    # Generate token for the user
    with app.app_context():
        token = create_access_token(identity=1)

    headers = {
        'Authorization': f'Bearer {token}'
    }
    response = client.get('/api/v1/customer-details', headers=headers)
    assert response.status_code == 200
    assert response.json['success'] is True
    assert 'customer' in response.json
    assert 'bookings' in response.json


def test_retrieve_customers_by_name(client):
    
    with app.app_context():

        additional_claims = {'is_staff': True}
        token = create_access_token(identity='staff@gmail.com', additional_claims=additional_claims)

    headers = {
        'Authorization': f'Bearer {token}'
    }
    response = client.get('/api/v1/customer-search/JohnDoe', headers=headers)
    assert response.status_code == 200
    assert response.json['success'] is True
    assert len(response.json['customers']) == 1

def test_retrieve_customers_by_name_fail(client):
    
    with app.app_context():
        token = create_access_token(identity=1)  

    headers = {
        'Authorization': f'Bearer {token}'
    }
    response = client.get('/api/v1/customer-search/JohnDoe', headers=headers)
    assert response.status_code == 403
    assert response.json['success'] is False



def test_delete_customer_success(client):
    # Generate token for the user
    with app.app_context():
        token = create_access_token(identity=1)

    headers = {
        'Authorization': f'Bearer {token}'
    }
    response = client.delete('/api/v1/delete-customer/1', headers=headers)
    assert response.status_code == 200
    assert response.json['message'] == 'Customer account deleted successfully'


def test_confirm_password_success(client):
    # Generate token for the user
    with app.app_context():
        token = create_access_token(identity=1)

    headers = {
        'Authorization': f'Bearer {token}'
    }
    data = {
        'password': 'password'
    }
    response = client.post('/api/v1/confirm-password/', json=data, headers=headers)
    assert response.status_code == 200
    assert response.json['success'] is True
    assert response.json['message'] == 'Password confirmed'

