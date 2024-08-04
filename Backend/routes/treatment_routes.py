"""
Treatment routes 
* retrieve all treatments
* retrieve available treatments
* add treatment
* edit treatment
"""
from app import app, db, staff_required
from flask import request, jsonify

from models.treatment import Treatment

@app.route('/api/v1/treatments', methods=['GET'])
def retrieve_treatments():
    if request.method == 'GET':
        all_treatments = Treatment.query.all()
        if all_treatments:
            return jsonify({
                'success' : True,
                'treatments' : [treatment.format() for treatment in all_treatments]
            }), 200
        return jsonify(message='No treatment records found.'), 404

@app.route('/api/v1/available-treatments', methods=['GET'])
def retrieve_available_treaments():
    if request.method == 'GET':
        available_treatments = Treatment.query.filter_by(is_available=True).all()
        if available_treatments:
            return jsonify({
                'success' : True,
                'treatments' : [treatment.format() for treatment in available_treatments]
            }), 200
        return jsonify(message='No treatment records found.'), 404
    
@app.route('/api/v1/add-treatment', methods=['POST'])
@staff_required()
def add_treatment():
    if request.method == 'POST':
        title = request.get_json().get('title')
        description = request.get_json().get('description')
        price = request.get_json().get('price')
        is_available = request.get_json().get('is_available')

        if title and description and price:

            new_treatment = Treatment(
                title = title,
                description = description,
                price = price,
                is_available = is_available
            )
            db.session.add(new_treatment)
            db.session.commit()
            return jsonify({
                'success' : True,
                'new_treatment' : new_treatment.format()
            }), 201
        else:
            return jsonify({'error': 'Invalid input values'}), 400

@app.route('/api/v1/treatments/<int:treatment_id>', methods=['PUT'])
@staff_required()
def update_treatment(treatment_id):

    treatment = Treatment.query.get(treatment_id)
    print(treatment)

    if treatment is None:
        return jsonify({
            'success': False,
            'message': 'Treatment not found.'}), 404

    #Gets news values and defaults to original if no value is passed
    data = request.get_json()
    title = data.get('title', treatment.title)
    description = data.get('description', treatment.description)
    price = data.get('price', treatment.price)
    is_available = data.get('is_available', treatment.is_available)
    
    treatment.title = title
    treatment.description = description
    treatment.price = price
    treatment.is_available = is_available

    # Commit the changes to the database
    db.session.commit()

    return jsonify({
        'success': True,
        'treatment': treatment.format() 
    }), 200