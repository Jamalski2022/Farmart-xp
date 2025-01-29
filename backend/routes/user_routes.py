# routes/user_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, db

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify(user.to_dict())
@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    data = request.json
    
    if 'email' in data:
        # Add validation for email uniqueness
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "Email already in use"}), 400
        user.email = data['email']
    
    if 'username' in data:
        # Add validation for username uniqueness
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"error": "Username already taken"}), 400
        user.username = data['username']
    
    if 'password' in data:
        user.set_password(data['password'])
        
    db.session.commit()
    return jsonify(user.to_dict())

