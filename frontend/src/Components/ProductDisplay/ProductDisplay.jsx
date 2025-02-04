

// ProductDisplay.jsx
import React from 'react'
import './ProductDisplay.css'
import star_icon from '../assets/favorite.png'
import star_dull_icon from '../assets/dull.png'
import { useShop } from '../../Context/ShopContext'

const ProductDisplay = ({ product }) => {
    const { addToCart } = useShop();
    
    if (!product) {
        return <div className="productdisplay">Loading...</div>;
    }

    const handleAddToCart = () => {
        addToCart(product);
    }

    return (
        <div className='productdisplay'>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    {product.image && Array(4).fill().map((_, i) => (
                        <img key={i} src={product.image} alt="" />
                    ))}
                </div>
                <div className="productdisplay-image">
                    <img 
                        className='productdisplay-main-img' 
                        src={product.image} 
                        alt={product.name}
                        style={{ 
                            width: '200px', 
                            height: '440px',
                            objectFit:'cover',
                            borderRadius:"20px",
                            margin: '0 auto' 
                        }}
                    />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-stars">
                    {Array(4).fill().map((_, i) => (
                        <img key={i} src={star_icon} alt="" />
                    ))}
                    <img src={star_dull_icon} alt="" />
                    <p>(122)</p>
                </div>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">
                        ${product.old_price}
                    </div>
                    <div className="productdisplay-right-prices-new">
                        ${product.new_price || product.price}
                    </div>
                </div>
                <div className="productdisplay-right-description">
                    {product.description || 'No description available'}
                </div>
                <div className="productdisplay-right-size">
                    <h1>Select size</h1>
                    <div className="productdisplay-right-sizes">
                        {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                            <div key={size}>{size}</div>
                        ))}
                    </div>
                </div>
                <button onClick={handleAddToCart}>ADD TO CART</button>
                <p className='productdisplay-right-category'>
                    <span>Category: </span>{product.category}
                </p>
                <p className='productdisplay-right-category'>
                    <span>Tags: </span>Animal
                </p>
            </div>
        </div>
    )
}

export default ProductDisplay;