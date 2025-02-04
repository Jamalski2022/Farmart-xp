from flask import Blueprint, jsonify, request
from models import User
from config import db
from flask_jwt_extended import jwt_required, get_jwt_identity

user_bp = Blueprint('user', __name__)

# Get all users (admin only)
@user_bp.route("/", methods=["GET"])
def get_users():
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users])
    except Exception as e:
        print(f"Error fetching users: {str(e)}")
        return jsonify({"error": "Failed to fetch users"}), 500

# Get current user profile
@user_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    try:
        current_user = get_jwt_identity()
        user = User.query.get(current_user["id"])
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user.to_dict())
    except Exception as e:
        print(f"Error fetching profile: {str(e)}")
        return jsonify({"error": "Failed to fetch profile"}), 500

# Update user profile
@user_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    try:
        current_user = get_jwt_identity()
        user = User.query.get(current_user["id"])
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()
        if "email" in data:
            user.email = data["email"]
        if "username" in data:
            # Check if username is already taken
            existing_user = User.query.filter_by(username=data["username"]).first()
            if existing_user and existing_user.id != user.id:
                return jsonify({"error": "Username already taken"}), 400
            user.username = data["username"]

        db.session.commit()
        return jsonify(user.to_dict())
    except Exception as e:
        print(f"Error updating profile: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Failed to update profile"}), 500

# Get specific user
@user_bp.route("/<int:id>", methods=["GET"])
def get_user(id):
    try:
        user = User.query.get(id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user.to_dict())
    except Exception as e:
        print(f"Error fetching user: {str(e)}")
        return jsonify({"error": "Failed to fetch user"}), 500

# Delete user (admin only)
@user_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_user(id):
    try:
        current_user = get_jwt_identity()
        if current_user["role"] != "admin":
            return jsonify({"error": "Admin access required"}), 403

        user = User.query.get(id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting user: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Failed to delete user"}), 500