# from flask import Flask, jsonify,request
# from flask_sqlalchemy import SQLAlchemy
# from flask_cors import CORS
# from functools import wraps
# from config import db  # Import db from config
# from models import  Animal,User, bcrypt,Order  # Import models user and order not yet
# from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
# from routes.user_routes import user_bp
# from routes.order_routes import order_bp



# app = Flask(__name__)

# app.register_blueprint(user_bp, url_prefix='/api/users')
# app.register_blueprint(order_bp, url_prefix='/api/orders')
# # CORS(app)  # Enable CORS for frontend interaction
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:5174"}})

# # Configure the app
# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///animals.db"
# app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# app.config["JWT_SECRET_KEY"] = "supersecretkey"  # Change this in production

# # Initialize extensions
# CORS(app)
# db.init_app(app)  # Initialize db with app
# bcrypt.init_app(app)  # Initialize bcrypt with app
# jwt = JWTManager(app)

# @app.route("/")
# def home():
#     return jsonify({"message": "Welcome to the Animal Shop API!"})

# # 🐾 Get all animals
# @app.route("/animals", methods=["GET"])
# def get_animals():
#     animals = Animal.query.all()
#     return jsonify([animal.to_dict() for animal in animals])

# # 🐾 Get single animal by ID
# @app.route("/animals/<int:id>", methods=["GET"])
# def get_animal(id):
#     animal = Animal.query.get(id)
#     if not animal:
#         return jsonify({"error": "Animal not found"}), 404
#     return jsonify(animal.to_dict())

# # 🐾 Add a new animal
# @app.route("/animals", methods=["POST"])
# def add_animal():
#     data = request.json
#     new_animal = Animal(
#         name=data["name"],
#         category=data["category"],
#         price=data["price"],
#         image_url=data.get("image_url", "")
#     )
#     db.session.add(new_animal)
#     db.session.commit()
#     return jsonify(new_animal.to_dict()), 201

# # 🐾 Update an existing animal
# @app.route("/animals/<int:id>", methods=["PUT"])
# def update_animal(id):
#     animal = Animal.query.get(id)
#     if not animal:
#         return jsonify({"error": "Animal not found"}), 404
    
#     data = request.json
#     animal.name = data.get("name", animal.name)
#     animal.category = data.get("category", animal.category)
#     animal.price = data.get("price", animal.price)
#     animal.image_url = data.get("image_url", animal.image_url)

#     db.session.commit()
#     return jsonify(animal.to_dict())

# # 🐾 Delete an animal
# @app.route("/animals/<int:id>", methods=["DELETE"])
# def delete_animal(id):
#     animal = Animal.query.get(id)
#     if not animal:
#         return jsonify({"error": "Animal not found"}), 404
    
#     db.session.delete(animal)
#     db.session.commit()
#     return jsonify({"message": "Animal deleted"}), 200

# # 🔹 Signup Route
# @app.route("/signup", methods=["POST"])
# def signup():
#     data = request.json
#     if User.query.filter_by(username=data["username"]).first():
#         return jsonify({"error": "Username already exists"}), 400

#     # Prevent normal users from signing up as admin
#     role = data.get("role", "customer").lower()
#     if role not in ["admin", "customer"]:
#         return jsonify({"error": "Invalid role"}), 400

#     new_user = User(username=data["username"], email=data["email"], role=role)
#     new_user.set_password(data["password"])

#     db.session.add(new_user)
#     db.session.commit()

#     return jsonify({"message": "User created successfully", "role": new_user.role}), 201

# # 🔹 Login Route
# @app.route("/login", methods=["POST"])
# def login():
#     data = request.json
#     user = User.query.filter_by(username=data["username"]).first()

#     if not user or not user.check_password(data["password"]):
#         return jsonify({"error": "Invalid credentials"}), 401

#     access_token = create_access_token(identity={"id": user.id, "role": user.role})
#     return jsonify({"access_token": access_token, "user": user.to_dict()}), 200

# # 🔹 Protected Route Example
# @app.route("/profile", methods=["GET"])
# @jwt_required()
# def profile():
#     user_id = get_jwt_identity()
#     user = User.query.get(user_id)

#     if not user:
#         return jsonify({"error": "User not found"}), 404

#     return jsonify(user.to_dict()), 200

# def admin_required(fn):
#     @wraps(fn)
#     def wrapper(*args, **kwargs):
#         identity = get_jwt_identity()  # Get the user identity from JWT
#         if identity["role"] != "admin":  # Check if the role is 'admin'
#             return jsonify({"error": "Admin access required"}), 403
#         return fn(*args, **kwargs)  # Proceed with the request if user is an admin
#     return wrapper

# @app.route("/admin/dashboard", methods=["GET"])
# @jwt_required()
# @admin_required
# def admin_dashboard():
#     return jsonify({"message": "Welcome Admin! Here you can manage products, users, and orders."}), 200

# @app.route("/admin/products", methods=["POST"])
# @jwt_required()
# @admin_required
# def add_product():
#     data = request.json
#     new_product = Product(name=data["name"], price=data["price"], category=data["category"])
#     db.session.add(new_product)
#     db.session.commit()
#     return jsonify({"message": "Product added successfully"}), 201

# @app.route("/admin/products/<int:product_id>", methods=["DELETE"])
# @jwt_required()
# @admin_required
# def delete_product(product_id):
#     product = Product.query.get(product_id)
#     if not product:
#         return jsonify({"error": "Product not found"}), 404

#     db.session.delete(product)
#     db.session.commit()
#     return jsonify({"message": "Product deleted successfully"}), 200

# # Get all orders
# @app.route("/orders", methods=["GET"])
# @admin_required
# def get_orders():
#     orders = Order.query.all()
#     return jsonify([order.to_dict() for order in orders])

# # Add new order (only customers)
# @app.route("/orders", methods=["POST"])
# def add_order():
#     data = request.get_json()
#     new_order = Order(
#         user_id=data.get("user_id"),
#         animal_id=data.get("animal_id"),
#         quantity=data.get("quantity")
#     )
#     db.session.add(new_order)
#     db.session.commit()
#     return jsonify(new_order.to_dict()), 201


# # Initialize db with app
# # db.init_app(app)

# # Create tables
# # with app.app_context():
# #     db.create_all()

# if __name__ == "__main__":
#     with app.app_context():
#         db.create_all()
#     app.run(debug=True)



from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from functools import wraps
from config import db  # Import db from config
from models import Animal, User, bcrypt, Order  # Make sure all models are imported
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from routes.user_routes import user_bp
from routes.order_routes import order_bp

app = Flask(__name__)

# Configure the app
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///animals.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "supersecretkey"  # Change this in production

# Initialize extensions
CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": ["http://localhost:5174"],  # Your frontend URL
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
        "expose_headers": ["Content-Range", "X-Content-Range"]
    }
})
db.init_app(app)  # Initialize db with app
bcrypt.init_app(app)  # Initialize bcrypt with app
jwt = JWTManager(app)

# Register blueprints after the app is configured
app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(order_bp, url_prefix='/api/orders')

@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Animal Shop API!"})

# 🐾 Get all animals
@app.route("/animals", methods=["GET"])
def get_animals():
    animals = Animal.query.all()
    return jsonify([animal.to_dict() for animal in animals])

# 🐾 Get single animal by ID
@app.route("/animals/<int:id>", methods=["GET"])
def get_animal(id):
    animal = Animal.query.get(id)
    if not animal:
        return jsonify({"error": "Animal not found"}), 404
    return jsonify(animal.to_dict())

# 🐾 Add a new animal
@app.route("/animals", methods=["POST"])
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

# 🐾 Update an existing animal
@app.route("/animals/<int:id>", methods=["PUT"])
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

# 🐾 Delete an animal
@app.route("/animals/<int:id>", methods=["DELETE"])
def delete_animal(id):
    animal = Animal.query.get(id)
    if not animal:
        return jsonify({"error": "Animal not found"}), 404
    
    db.session.delete(animal)
    db.session.commit()
    return jsonify({"message": "Animal deleted"}), 200

# 🔹 Signup Route
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Username already exists"}), 400

    # Prevent normal users from signing up as admin
    role = data.get("role", "customer").lower()
    if role not in ["admin", "customer"]:
        return jsonify({"error": "Invalid role"}), 400

    new_user = User(username=data["username"], email=data["email"], role=role)
    new_user.set_password(data["password"])

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully", "role": new_user.role}), 201

# 🔹 Login Route
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data["username"]).first()

    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity={"id": user.id, "role": user.role})
    return jsonify({"access_token": access_token, "user": user.to_dict()}), 200

# 🔹 Protected Route Example
@app.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict()), 200

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        identity = get_jwt_identity()  # Get the user identity from JWT
        if identity["role"] != "admin":  # Check if the role is 'admin'
            return jsonify({"error": "Admin access required"}), 403
        return fn(*args, **kwargs)  # Proceed with the request if user is an admin
    return wrapper

@app.route("/admin/dashboard", methods=["GET"])
@jwt_required()
@admin_required
def admin_dashboard():
    return jsonify({"message": "Welcome Admin! Here you can manage products, users, and orders."}), 200

# # Get all orders
# @app.route("/orders", methods=["GET"])
# @admin_required
# def get_orders():
#     orders = Order.query.all()
#     return jsonify([order.to_dict() for order in orders])

# # Add new order (only customers)
# @app.route("/orders", methods=["POST"])
# def add_order():
#     data = request.get_json()
#     new_order = Order(
#         user_id=data.get("user_id"),
#         animal_id=data.get("animal_id"),
#         quantity=data.get("quantity")
#     )
#     db.session.add(new_order)
#     db.session.commit()
#     return jsonify(new_order.to_dict()), 201

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
