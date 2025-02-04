// src/Components/CartItems/CartItems.jsx
import React from 'react';
import { useCart } from "../../Context/CartContext";
import { Link } from 'react-router-dom';
import './CartItems.css';

const CartItems = () => {
  const { state, dispatch } = useCart();

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const getTotalAmount = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      
      {state.items.map((item) => (
        <div key={item.id}>
          <div className="cartitems-format cartitems-format-main">
            <img src={item.image} alt="" className='carticon-product-icon' />
            <p>{item.name}</p>
            <p>${item.price}</p>
            <div className="quantity-controls">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <p>${item.price * item.quantity}</p>
            <img 
              className='cartitems-remove-icon' 
              src="/remove-icon.png" 
              onClick={() => removeFromCart(item.id)} 
              alt="Remove" 
            />
          </div>
          <hr/>
        </div>
      ))}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${getTotalAmount()}</p>
            </div>
            <hr/>
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>${getTotalAmount()}</h3>
            </div>
          </div>
          {state.items.length > 0 && (
            <Link to="/checkout">
              <button>PROCEED TO CHECKOUT</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItems;
