from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from functools import wraps
from config import db  # Import db from config
from models import Animal, User, bcrypt, Order  # Make sure all models are imported
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from routes.user_routes import user_bp
from routes.order_routes import order_bp
from flask import Blueprint
from routes.animal_routes import animal_bp  # Import the animal blueprint
from flask import make_response


app = Flask(__name__)
 

# Configure the app
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///animals.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "supersecretkey"  # Change this in production
app.config["JWT_ACCESS_COOKIE_PATH"] = "/api/"
app.config["JWT_COOKIE_CSRF_PROTECT"] = False  # For development
app.config["JWT_COOKIE_SECURE"] = False  # Set to True in production



CORS(app, supports_credentials=True, resources={
    r"/api/*": {
        "origins": "http://localhost:5174",  # Allow only frontend
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": [
            "Content-Type", "Authorization", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"
        ],
        "expose_headers": ["Content-Range", "X-Content-Range"]
    }
})


## CORS(app)  # Allows all origins

db.init_app(app)  # Initialize db with app
bcrypt.init_app(app)  # Initialize bcrypt with app
jwt = JWTManager(app)

# Register blueprints after the app is configured
app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(order_bp, url_prefix='/api/orders')
app.register_blueprint(animal_bp, url_prefix='/api')



@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5174")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 200


# Error handler for invalid routes
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error"}), 500

@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Animal Shop API!"})

1

@app.route("/api/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        print(f"Signup attempt received with data: {data}")
        
        # Validate required fields
        if not all(k in data for k in ["username", "email", "password"]):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Check if user exists in a transaction
        with db.session.begin():
            if User.query.filter_by(username=data["username"]).first():
                return jsonify({"error": "Username already exists"}), 400
            
            if User.query.filter_by(email=data["email"]).first():
                return jsonify({"error": "Email already exists"}), 400
            
            # Create new user
            new_user = User(
                username=data["username"],
                email=data["email"],
                role=data.get("role", "customer")
            )
            new_user.set_password(data["password"])
            
            # Add and commit in the same transaction
            db.session.add(new_user)
        
        # Create access token
        access_token = create_access_token(identity={"id": new_user.id, "role": new_user.role})
        
        print(f"User created successfully: {new_user.username}")
        # Verify user was created
        created_user = User.query.filter_by(username=data["username"]).first()
        if not created_user:
            raise Exception("User creation verification failed")
            
        return jsonify({
            "message": "User created successfully",
            "access_token": access_token,
            "user": new_user.to_dict()
        }), 201
        
    except Exception as e:
        print(f"Error during signup: {str(e)}")
        print(traceback.format_exc())  # Print full traceback
        db.session.rollback()
        return jsonify({"error": "An error occurred during signup"}), 500

@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        print(f"Login attempt received with data: {data}")
        
        if not all(k in data for k in ["username", "password"]):
            return jsonify({"error": "Missing username or password"}), 400
        
        # Use a transaction for consistent reads
        with db.session.begin():
            user = User.query.filter_by(username=data["username"]).first()
            print(f"User lookup result: {'Found' if user else 'Not found'} for username: {data['username']}")
            
            if not user:
                return jsonify({"error": "Invalid credentials"}), 401
            
            if not user.check_password(data["password"]):
                print(f"Invalid password for user: {user.username}")
                return jsonify({"error": "Invalid credentials"}), 401
            
            # Create token
            access_token = create_access_token(identity={"id": user.id, "role": user.role})
            print(f"Login successful for user: {user.username}")
            
            return jsonify({
                "access_token": access_token,
                "user": user.to_dict()
            }), 200
            
    except Exception as e:
        print(f"Login error occurred: {str(e)}")
        print(traceback.format_exc())  # Print full traceback
        return jsonify({"error": "An error occurred during login"}), 500

# Add a test route to verify database state
@app.route("/api/verify-user/<username>", methods=["GET"])
def verify_user(username):
    try:
        user = User.query.filter_by(username=username).first()
        if user:
            return jsonify({
                "exists": True,
                "username": user.username,
                "email": user.email,
                "role": user.role
            })
        return jsonify({"exists": False}), 404
    except Exception as e:
        print(f"Error verifying user: {str(e)}")
        return jsonify({"error": str(e)}), 500
    

@app.route("/api/test/users", methods=["GET"])
def test_users():
    try:
        # Test database connection and user table
        users = User.query.all()
        return jsonify({
            "message": "Database connection successful",
            "user_count": len(users),
            "users": [{"username": user.username, "email": user.email} for user in users]
        })
    except Exception as e:
        return jsonify({
            "error": "Database error",
            "details": str(e)
        }), 500

# Route to check if a specific user exists
@app.route("/api/test/user/<username>", methods=["GET"])
def test_user(username):
    try:
        user = User.query.filter_by(username=username).first()
        if user:
            return jsonify({
                "message": "User found",
                "username": user.username,
                "email": user.email
            })
        return jsonify({"message": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
        current_user = get_jwt_identity()
        if current_user["role"] != "admin":
            return jsonify({"error": "Admin access required"}), 403
        return fn(*args, **kwargs)
    return wrapper

@app.route("/admin/dashboard", methods=["GET"])
@jwt_required()
@admin_required
def admin_dashboard():
    return jsonify({"message": "Welcome Admin! Here you can manage products, users, and orders."}), 200


# @app.route("/api/animals", methods=["GET"])
# def get_animals():
#     return jsonify({"message": "Animals fetched successfully"})

# if __name__ == "__main__":
#     app.run(debug=True, port=5000)

@app.route("/api/animals", methods=["GET", "POST"])
def get_animals():
    response = jsonify({"message": "Success", "data": []})
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5174"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response


@app.route("/api/animals", methods=["POST"])
@jwt_required()
def add_animal():
    try:
        data = request.get_json()
        new_animal = Animal(
            name=data["name"],
            breed=data["breed"],
            price=data["price"],
            image_url=data["image_url"],
            description=data.get("description", ""),  # Optional field
            seller_id=get_jwt_identity()["id"]  # Assuming a logged-in farmer
        )

        db.session.add(new_animal)
        db.session.commit()

        return jsonify(new_animal.to_dict()), 201  # Return the newly created animal
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
