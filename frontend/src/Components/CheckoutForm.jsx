import React, { useState } from 'react';
import { useShop } from '../Context/ShopContext';
import { orderAPI } from '../services/api';

const CheckoutForm = () => {
  const { cartItems, clearCart } = useShop();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.new_price * item.quantity, 0);
  };

//   const handleCheckout = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const orderResponse = await orderAPI.create({
//         items: cartItems.map(item => ({
//           animal_id: item.id,
//           quantity: item.quantity,
//           price: item.new_price
//         }))
//       });

//       const paymentResponse = await orderAPI.initiatePayment({
//         order_id: orderResponse.data.id,
//         phone_number: phoneNumber
//       });

//       if (paymentResponse.data.message === 'Payment initiated') {
//         clearCart();
//         alert('Please check your phone to complete the M-Pesa payment');
//       }

//     } catch (err) {
//       setError(err.response?.data?.error || 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="checkout-form">
//       <h2>Checkout</h2>
//       {error && <div className="error">{error}</div>}
      
//       <form onSubmit={handleCheckout}>
//         <div className="form-group">
//           <label>M-Pesa Phone Number</label>
//           <input
//             type="text"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             placeholder="254XXXXXXXXX"
//             required
//           />
//         </div>

//         <div className="order-summary">
//           <h3>Order Summary</h3>
//           {cartItems.map(item => (
//             <div key={item.id} className="order-item">
//               <span>{item.name}</span>
//               <span>x{item.quantity}</span>
//               <span>${item.new_price * item.quantity}</span>
//             </div>
//           ))}
//           <div className="total">
//             <strong>Total:</strong>
//             <span>${getTotalAmount()}</span>
//           </div>
//         </div>

//         <button 
//           type="submit" 
//           disabled={loading || cartItems.length === 0}
//         >
//           {loading ? 'Processing...' : 'Pay with M-Pesa'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CheckoutForm;

const handleCheckout = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
      // Create order (simulated backend order creation)
      const orderResponse = await orderAPI.create({
          items: cartItems.map(item => ({
              animal_id: item.id,
              quantity: item.quantity,
              price: item.new_price
          }))
      });

      // Removed M-Pesa API payment initiation
      // const paymentResponse = await orderAPI.initiatePayment({
      //     order_id: orderResponse.data.id,
      //     phone_number: phoneNumber
      // });

      // if (paymentResponse.data.message === 'Payment initiated') {
      //     clearCart();
      //     alert('Please check your phone to complete the M-Pesa payment');
      // }

      // New change: Simulated success message instead of real payment API
      clearCart(); // Clearing cart after checkout
      alert('Payment successful! Your order has been placed.'); // Replaced API response with a simple alert

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
              {cartItems.map(item => (
                  <div key={item.id} className="order-item">
                      <span>{item.name}</span>
                      <span>x{item.quantity}</span>
                      <span>${item.new_price * item.quantity}</span>
                  </div>
              ))}
              <div className="total">
                  <strong>Total:</strong>
                  <span>${getTotalAmount()}</span>
              </div>
          </div>

          <button 
              type="submit" 
              disabled={loading || cartItems.length === 0}
          >
              {loading ? 'Processing...' : 'Pay with M-Pesa'}
          </button>
      </form>
  </div>
);
};

export default CheckoutForm;