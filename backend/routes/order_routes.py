from flask import Blueprint, jsonify, request
from models import Order
from config import db
from flask_jwt_extended import jwt_required, get_jwt_identity

order_bp = Blueprint('order', __name__)

# Get all orders
@order_bp.route("/", methods=["GET"])
# @jwt_required()
def get_orders():
    try:
        orders = Order.query.all()
        return jsonify([order.to_dict() for order in orders])
    except Exception as e:
        print(f"Error fetching orders: {str(e)}")
        return jsonify({"error": "Failed to fetch orders"}), 500

# Add new order
@order_bp.route("/", methods=["POST"])
@jwt_required()
def add_order():
    try:
        data = request.get_json()
        current_user = get_jwt_identity()
        
        new_order = Order(
            user_id=current_user["id"],  # Get user ID from JWT token
            animal_id=data.get("animal_id"),
            quantity=data.get("quantity", 1)
        )
        db.session.add(new_order)
        db.session.commit()
        return jsonify(new_order.to_dict()), 201
    except Exception as e:
        print(f"Error creating order: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Failed to create order"}), 500

# Get specific order
@order_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_order(id):
    try:
        order = Order.query.get(id)
        if not order:
            return jsonify({"error": "Order not found"}), 404
        return jsonify(order.to_dict())
    except Exception as e:
        print(f"Error fetching order: {str(e)}")
        return jsonify({"error": "Failed to fetch order"}), 500

# Update order
@order_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_order(id):
    try:
        order = Order.query.get(id)
        if not order:
            return jsonify({"error": "Order not found"}), 404
        
        data = request.get_json()
        if "quantity" in data:
            order.quantity = data["quantity"]
        
        db.session.commit()
        return jsonify(order.to_dict())
    except Exception as e:
        print(f"Error updating order: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Failed to update order"}), 500

# Delete order
@order_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_order(id):
    try:
        order = Order.query.get(id)
        if not order:
            return jsonify({"error": "Order not found"}), 404
        
        db.session.delete(order)
        db.session.commit()
        return jsonify({"message": "Order deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting order: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Failed to delete order"}), 500