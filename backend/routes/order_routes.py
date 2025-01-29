# routes/order_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Order, Animal, db


order_bp = Blueprint('order', __name__)

@order_bp.route('/orders', methods=['POST'])
@jwt_required()
def create_order():
    current_user_id = get_jwt_identity()
    data = request.json
    
    # Handle cart items
    cart_items = data.get('items', [])
    orders = []
    
    for item in cart_items:
        animal = Animal.query.get(item['animal_id'])
        if not animal:
            return jsonify({'error': f'Animal with id {item["animal_id"]} not found'}), 404
            
        order = Order(
            user_id=current_user_id,
            animal_id=item['animal_id'],
            quantity=item['quantity'],
            total_price=animal.price * item['quantity']
        )
        orders.append(order)
        db.session.add(order)
    
    db.session.commit()
    return jsonify({'message': 'Orders created successfully'}), 201

@order_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_user_orders():
    current_user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=current_user_id).all()
    return jsonify([order.to_dict() for order in orders])
