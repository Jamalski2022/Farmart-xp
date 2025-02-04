import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../Context/ShopContext';
import './CartItems.css';

const CartItems = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateCartItemQuantity, 
    getTotalCartAmount 
  } = useShop();

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
      
      {cartItems.map((item) => (
        <div key={item.id}>
          <div className="cartitems-format cartitems-format-main">
            <img src={item.image} alt="" className='carticon-product-icon' />
            <p>{item.name}</p>
            <p>${item.new_price}</p>
            <div className="quantity-controls">
              <button onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <p>${item.new_price * item.quantity}</p>
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
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr/>
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>${getTotalCartAmount()}</h3>
            </div>
          </div>
          {cartItems.length > 0 && (
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
