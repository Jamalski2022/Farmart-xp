from flask import Blueprint, jsonify, request
from models import Animal
from config import db

animal_bp = Blueprint('animal', __name__)

@animal_bp.route("/animals", methods=["GET"])
def get_animals():
    try:
        animals = Animal.query.all()
        return jsonify([animal.to_dict() for animal in animals])
    except Exception as e:
        print(f"Error fetching animals: {str(e)}")
        return jsonify({"error": "Failed to fetch animals"}), 500

@animal_bp.route("/animals/<int:id>", methods=["GET"])
def get_animal(id):
    animal = Animal.query.get(id)
    if not animal:
        return jsonify({"error": "Animal not found"}), 404
    return jsonify(animal.to_dict())

@animal_bp.route("/animals", methods=["POST"])
def add_animal():
    data = request.json
    new_animal = Animal(
        name=data["name"],
        category=data["category"],
        price=data["price"],
        image_url=data.get("image_url", "")
    )
    db.session.add(new_animal)
    db.session.commit()
    return jsonify(new_animal.to_dict()), 201

@animal_bp.route("/animals/<int:id>", methods=["PUT"])
def update_animal(id):
    animal = Animal.query.get(id)
    if not animal:
        return jsonify({"error": "Animal not found"}), 404
    
    data = request.json
    animal.name = data.get("name", animal.name)
    animal.category = data.get("category", animal.category)
    animal.price = data.get("price", animal.price)
    animal.image_url = data.get("image_url", animal.image_url)

    db.session.commit()
    return jsonify(animal.to_dict())

@animal_bp.route("/animals/<int:id>", methods=["DELETE"])
def delete_animal(id):
    animal = Animal.query.get(id)
    if not animal:
        return jsonify({"error": "Animal not found"}), 404
    
    db.session.delete(animal)
    db.session.commit()
    return jsonify({"message": "Animal deleted"}), 200