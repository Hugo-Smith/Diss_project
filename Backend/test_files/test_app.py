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
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://admin:admin123@localhost:5432/testdb'
    
    with app.app_context():
        db.create_all()  # Set up the database schema
        customer = Customer(
            customer_id=1,
            first_name='John',
            surname='Doe',
            email='test@gmail.com',
            password=bcrypt.generate_password_hash('password').decode('utf-8')
        )
        staff = Staff(
            staff_id=1,
            first_name='Mary',
            surname='jones',
            email='staff@gmail.com',
            password=bcrypt.generate_password_hash('password').decode('utf-8')
        )
        db.session.add(customer)
        db.session.add(staff)
        db.session.commit()

    with app.test_client() as client:
        yield client

    # Tear down
    with app.app_context():
        db.drop_all()

class TestFlaskApp:
    """
    LOGIN TESTS:
        -test successful login
        -test missing email
        -test missing password
        -test non existent user 
        -test incorrect password with correct user
    """

    def test_index(self, client):
        response = client.get('/')
        assert response.status_code == 200
        assert b'Welcome to Diss REST API Server' in response.data


    def test_login_success(self, client):
        response = client.post('api/v1/login', json={
            'email': 'test@gmail.com',
            'password': 'password'
        })

        assert response.status_code == 200
        assert response.is_json

        data = response.get_json()
        assert data['success'] is True
        assert 'access_token' in data
    
    def test_login_missing_email(self, client):

        response = client.post('/api/v1/login', json={
            'password': 'password'
        })
        
        assert response.status_code == 400
        assert response.is_json
        data = response.get_json()
        assert data['success'] is False
        assert data['message'] == 'Missing email or password'

    def test_login_missing_password(self, client):

        response = client.post('/api/v1/login', json={
            'email': 'test@gmail.com'
        })
        
        assert response.status_code == 400
        assert response.is_json
        data = response.get_json()
        assert data['success'] is False
        assert data['message'] == 'Missing email or password'

    def test_login_nonexistent_user(self, client):

        response = client.post('/api/v1/login', json={
            'email': 'nonexistent@example.com',
            'password': 'password'
        })
        
        assert response.status_code == 401
        assert response.is_json
        data = response.get_json()
        assert data['success'] is False
        assert data['message'] == 'Invalid email or password'
    
    def test_incorrect_password(self, client):

        response = client.post('/api/v1/login', json={
            'email': 'test@gmail.com',
            'password': 'incorrectpassword'
        })

        assert response.status_code == 401
        assert response.is_json
        data= response.get_json()
        assert data['success'] is False
        assert data['message'] == 'Invalid email or password'



    """
    STAFF TESTS:
        -test successful login & staff token
        -test missing email
        -test missing password
        -test non existent user 
        -test incorrect password with correct user
    """
    def test_staff_login_success(self, client):
        response = client.post('api/v1/staff-login', json={
            'email': 'staff@gmail.com',
            'password': 'password'
        })

        assert response.status_code == 200
        assert response.is_json

        data = response.get_json()
        assert data['success'] is True
        assert 'access_token' in data

        # Decode the JWT token to check the 'is_staff' claim
        access_token = data['access_token']
        decoded_token = decode_token(access_token)
        assert decoded_token['is_staff'] is True
    
    def test_staff_login_missing_email(self, client):

        response = client.post('/api/v1/staff-login', json={
            'password': 'password'
        })
        
        assert response.status_code == 400
        assert response.is_json
        data = response.get_json()
        assert data['success'] is False
        assert data['message'] == 'Missing email or password'

    def test_staff_login_missing_password(self, client):

        response = client.post('/api/v1/staff-login', json={
            'email': 'test@gmail.com'
        })
        
        assert response.status_code == 400
        assert response.is_json
        data = response.get_json()
        assert data['success'] is False
        assert data['message'] == 'Missing email or password'

    def test_staff_login_nonexistent_user(self, client):

        response = client.post('/api/v1/staff-login', json={
            'email': 'nonexistent@example.com',
            'password': 'password'
        })
        
        assert response.status_code == 401
        assert response.is_json
        data = response.get_json()
        assert data['success'] is False
        assert data['message'] == 'Invalid email or password'
    
    def test_staff_incorrect_password(self, client):

        response = client.post('/api/v1/login', json={
            'email': 'staff@gmail.com',
            'password': 'incorrectpassword'
        })

        assert response.status_code == 401
        assert response.is_json
        data= response.get_json()
        assert data['success'] is False
        assert data['message'] == 'Invalid email or password'
    
    """
    TOKEN AUTHENTICATOR TESTS
    -test customer valid token authentication
    -test staff token authentication
    -
    """
    """
    def test_verify_token_success(self, client):
        
        access_token = create_access_token(identity='test@example.com')

        response = client.post('/api/v1/verify-token', headers={
            'Authorization': f'Bearer {access_token}'
        })
        
        assert response.status_code == 200
        assert response.is_json
        data = response.get_json()
        assert 'success' in data
        assert data['success'] is True
        assert 'user' in data
        assert data['user'] == 'test@example.com'
    """

    def test_verify_token_failure(self, client):
        # With no authorisation header
        response = client.post('/api/v1/verify-token')

        assert response.status_code == 401
        assert response.is_json

        
        