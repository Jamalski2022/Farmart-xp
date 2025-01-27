import React, { useContext } from 'react'
import './ProductDisplay.css'
import star_icon from '../assets/favorite.png';
import star_dull_icon from '../assets/dull.png';
import { ShopContext } from '../../Context/ShopContext';


const ProductDisplay = (props) => {
    const {product} = props;
    const {addToCart} = useContext(ShopContext);
  return (
    <div className='productdisplay'>
        <div className="productdisplay-left">
            <div className="productdisplay-img-list">
                <img src={product.image} alt="" />
                <img src={product.image} alt="" />
                <img src={product.image} alt="" />
                <img src={product.image} alt="" />
            </div>
            <div className="productdisplay-image">
                <img className='productdisplay-main-img' src={product.image} alt="" style={{ width: '200px', height: '440px' ,objectFit:'cover',  borderRadius:"20px" ,margin: '0 auto' }}/>
            </div>
        </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
            <img src={star_icon} alt="" />
            <img src={star_icon}alt="" />
            <img src={star_icon} alt="" />
            <img src={star_icon} alt="" />
            <img src={star_dull_icon} alt="" />
            <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
            <div className="productdisplay-right-price-old">
                ${product.old_price}
            </div>
            <div className="productdisplay-right-prices-new">
                ${product.new_price}
            </div>
            <div className="productdisplay-right-description">
                A zebu cow mostly used for milking
            </div>
            <div className="productdisplay-right-size">
                <h1>Select size</h1>
                <div className="productdisplay-right-sizes">
                    <div>S</div>
                    <div>M</div>
                    <div>L</div>
                    <div>XL</div>
                    <div>XXL</div>
                </div>
            </div>
            <button onClick={()=>{addToCart(product.id)}}>ADD TO CART</button>
            <p className='productdisplay-right-category'><span>Category :</span>Goat, zefron big</p>
            <p className='productdisplay-right-category'><span>Tags :</span>Very young</p>
        </div>
      </div>
    </div>
  )
}

export default ProductDisplay
