# Farmart-xp

# FarmArt - Direct Farm Animal Marketplace

## About

FarmArt is an e-commerce platform designed to connect farmers directly with buyers, eliminating unnecessary middlemen and ensuring farmers receive fair compensation for their livestock. The platform facilitates transparent, direct transactions between farmers and buyers, fostering trust and fairness in the agricultural marketplace.

## Problem Statement

Traditionally, farmers and distributors conduct business based on trust and personal relationships. However, middlemen often exploit this system, leading to reduced profits for farmers through various unconventional methods. FarmArt aims to solve this problem by providing a direct, transparent marketplace for farm animal sales.

## Key Features

### For Farmers

- Secure authentication system (Login/Register)
- Animal management dashboard
  - Add new animals for sale
  - Update animal details
  - Remove listings
- Order management
  - View incoming orders
  - Confirm or reject orders
  - Track order status

### For Buyers

- User authentication system
- Comprehensive animal browsing
  - View all listed animals
  - Search by type and breed
  - Filter by breed and age
- Shopping features
  - Shopping cart functionality
  - Secure checkout process
  - Payment integration

## Project Structure

```
project/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── routes/
│   │   ├── user_routes.py
│   │   ├── animal_routes.py
│   │   └── order_routes.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
```

## Backend Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- PostgreSQL (for database)

### Installation Steps

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:

   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Set up the database:

   ```bash
   flask db upgrade
   ```

6. Run the Flask application:
   ```bash
   python app.py
   ```

The backend server will start running on `http://localhost:5000`

## Frontend Setup

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation Steps

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev-- --port 5174
   ```

The frontend application will start running on `http://localhost:5174`

## API Routes

### Authentication Routes

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Routes

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/orders` - Get user's orders

### Animal Routes

- `GET /api/animals` - Get all animals (with filtering options)
- `POST /api/animals` - Create a new animal listing (farmers only)
- `GET /api/animals/<id>` - Get animal by ID
- `PUT /api/animals/<id>` - Update animal (farmers only)
- `DELETE /api/animals/<id>` - Delete animal listing (farmers only)
- `GET /api/animals/search` - Search animals by type/breed

### Order Routes

- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/<id>` - Get order by ID
- `PUT /api/orders/<id>/status` - Update order status (farmers only)
- `GET /api/orders/cart` - Get cart items
- `POST /api/orders/checkout` - Process checkout

## Environment Variables

### Backend

Create a `.env` file in the backend directory with:

```
DATABASE_URL=postgresql://username:password@localhost/farmart
SECRET_KEY=your_secret_key
STRIPE_API_KEY=your_stripe_key_for_payments
```

### Frontend

Create a `.env` file in the frontend directory with:

```
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## Database Schema

### Users

- id (Primary Key)
- email
- password_hash
- user_type (farmer/buyer)
- name
- contact_info

### Animals

- id (Primary Key)
- farmer_id (Foreign Key)
- type
- breed
- age
- price
- description
- status (available/sold)

### Orders

- id (Primary Key)
- buyer_id (Foreign Key)
- status
- total_amount
- created_at

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `python -m pytest`
5. Submit a pull request

   ## SLIDE PRESENTATION
   LINK: https://us.docworkspace.com/d/sIL7d7tQ42crIvQY
   ## WEBSITE URL
   LINK: https://jamalski2022.github.io/Farmart-xp/

## License

This project is licensed under the MIT License - see the LICENSE.md file for details

## Support

For support, please email support@farmart.com or open an issue in the repository.
