

// src/Components/CheckoutForm/CheckoutForm.jsx
import React, { useState } from 'react';
import { useCart } from '../Context/CartContext';
import { orderAPI } from '../services/api';

const CheckoutForm = () => {
  const { state, dispatch } = useCart();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderResponse = await orderAPI.createOrder({
        items: state.items.map(item => ({
          animal_id: item.id,
          quantity: item.quantity
        }))
      });

      const paymentResponse = await orderAPI.initiatePayment({
        order_id: orderResponse.data.id,
        phone_number: phoneNumber
      });

      if (paymentResponse.data.message === 'Payment initiated') {
        dispatch({ type: 'CLEAR_CART' });
        alert('Please check your phone to complete the M-Pesa payment');
      }

    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-form">
      <h2>Checkout</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleCheckout}>
        <div className="form-group">
          <label>M-Pesa Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="254XXXXXXXXX"
            required
          />
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          {state.items.map(item => (
            <div key={item.id} className="order-item">
              <span>{item.name}</span>
              <span>x{item.quantity}</span>
              <span>${item.price * item.quantity}</span>
            </div>
          ))}
          <div className="total">
            <strong>Total:</strong>
            <span>
              ${state.items.reduce((total, item) => total + item.price * item.quantity, 0)}
            </span>
          </div>
        </div>

        <button type="submit" disabled={loading || state.items.length === 0}>
          {loading ? 'Processing...' : 'Pay with M-Pesa'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;