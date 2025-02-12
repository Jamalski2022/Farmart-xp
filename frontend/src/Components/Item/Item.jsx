import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../Context/ShopContext';
import './Item.css';

const Item = (props) => {
  const { addToCart } = useShop();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      id: props.id,
      name: props.name,
      image: props.image,
      new_price: props.new_price,
      quantity: 1
    });
  };

  return (
    <div className='item'>
      <div className="item-image">
        <Link to={`/product/${props.id}`}>
          <img 
            onClick={() => window.scrollTo(0,0)} 
            src={props.image} 
            alt={props.name} 
            style={{ 
              width: '200px', 
              height: '300px',
              objectFit: 'cover',
              borderRadius: "20px",
              margin: '0 auto'
            }}
          />
        </Link>
        {/* <button 
          className="add-to-cart-button"
          onClick={handleAddToCart}
          aria-label={`Add ${props.name} to cart`}
        >
          Add to Cart
        </button> */}
      </div>
      <p className="item-name">{props.name}</p>
      <div className="item-prices">
        <div className="item-prices-new">
          ${props.new_price}
        </div>
        {props.old_price && (
          <div className="item-prices-old">
            ${props.old_price}
          </div>
        )}
      </div>
    </div>
  );
};

export default Item;