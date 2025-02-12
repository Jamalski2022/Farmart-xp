# routes/order_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Order, OrderItem, OrderStatus, PaymentStatus
from config import db
from datetime import datetime

order_bp = Blueprint('order', __name__)

@order_bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    try:
        data = request.get_json()
        current_user = get_jwt_identity()
        
        # Validate request data
        if not data.get('items'):
            return jsonify({'error': 'No items provided'}), 400
            
        # Create new order
        new_order = Order(
            user_id=current_user['id'],
            total_price=0,  # Will be calculated after adding items
            payment_method=data.get('payment_method'),
            shipping_address=data.get('shipping_address'),
            phone_number=data.get('phone_number'),
            notes=data.get('notes')
        )
        
        db.session.add(new_order)
        db.session.flush()  # Get the order ID
        
        # Add order items
        for item in data['items']:
            order_item = OrderItem(
                order_id=new_order.id,
                animal_id=item['animal_id'],
                quantity=item['quantity'],
                price=item['price']
            )
            db.session.add(order_item)
        
        # Calculate and update total price
        db.session.flush()
        new_order.total_price = new_order.calculate_total()
        
        db.session.commit()
        return jsonify(new_order.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@order_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    try:
        current_user = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Handle different user roles
        if current_user.get('role') == 'admin':
            # Admins can see all orders
            orders = Order.query.paginate(page=page, per_page=per_page)
        else:
            # Regular users see only their orders
            orders = Order.query.filter_by(user_id=current_user['id']).paginate(page=page, per_page=per_page)
        
        return jsonify({
            'orders': [order.to_dict() for order in orders.items],
            'total': orders.total,
            'pages': orders.pages,
            'current_page': orders.page
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@order_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    try:
        current_user = get_jwt_identity()
        order = Order.query.get_or_404(order_id)
        
        # Check authorization
        if current_user.get('role') != 'admin' and order.user_id != current_user['id']:
            return jsonify({'error': 'Unauthorized'}), 403
            
        return jsonify(order.to_dict())
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@order_bp.route('/<int:order_id>', methods=['PUT'])
@jwt_required()
def update_order(order_id):
    try:
        current_user = get_jwt_identity()
        order = Order.query.get_or_404(order_id)
        data = request.get_json()
        
        # Check authorization
        if current_user.get('role') != 'admin' and order.user_id != current_user['id']:
            return jsonify({'error': 'Unauthorized'}), 403
            
        # Only allow updates if order is pending
        if order.status != OrderStatus.PENDING:
            return jsonify({'error': 'Cannot update non-pending order'}), 400
            
        # Update order fields
        if 'shipping_address' in data:
            order.shipping_address = data['shipping_address']
        if 'phone_number' in data:
            order.phone_number = data['phone_number']
        if 'notes' in data:
            order.notes = data['notes']
            
        db.session.commit()
        return jsonify(order.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@order_bp.route('/<int:order_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_order(order_id):
    try:
        current_user = get_jwt_identity()
        order = Order.query.get_or_404(order_id)
        
        # Check authorization
        if current_user.get('role') != 'admin' and order.user_id != current_user['id']:
            return jsonify({'error': 'Unauthorized'}), 403
            
        # Only allow cancellation of pending orders
        if order.status != OrderStatus.PENDING:
            return jsonify({'error': 'Can only cancel pending orders'}), 400
            
        order.status = OrderStatus.CANCELLED
        db.session.commit()
        
        return jsonify(order.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@order_bp.route('/<int:order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    try:
        current_user = get_jwt_identity()
        
        # Only admins can update order status
        if current_user.get('role') != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
            
        order = Order.query.get_or_404(order_id)
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({'error': 'Status not provided'}), 400
            
        # Validate status
        if data['status'] not in vars(OrderStatus).values():
            return jsonify({'error': 'Invalid status'}), 400
            
        order.status = data['status']
        db.session.commit()
        
        return jsonify(order.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@order_bp.route('/<int:order_id>/payment', methods=['PUT'])
@jwt_required()
def update_payment_status(order_id):
    try:
        current_user = get_jwt_identity()
        
        # Only admins can update payment status
        if current_user.get('role') != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
            
        order = Order.query.get_or_404(order_id)
        data = request.get_json()
        
        if 'payment_status' not in data:
            return jsonify({'error': 'Payment status not provided'}), 400
            
        # Validate payment status
        if data['payment_status'] not in vars(PaymentStatus).values():
            return jsonify({'error': 'Invalid payment status'}), 400
            
        order.payment_status = data['payment_status']
        
        # If payment is completed, update order status
        if data['payment_status'] == PaymentStatus.PAID:
            order.status = OrderStatus.PROCESSING
            
        db.session.commit()
        return jsonify(order.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500