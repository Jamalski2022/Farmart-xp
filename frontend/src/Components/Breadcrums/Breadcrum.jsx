

// Breadcrum.jsx
import React from 'react'
import './Breadcrum.css'
import arrow_icon from '../assets/ui-pattern.png'

const Breadcrum = ({ product }) => {
  if (!product) {
    return <div className='breadcrum'>Loading...</div>;
  }

  return (
    <div className='breadcrum'>
      HOME <img src={arrow_icon} alt="" /> 
      SHOP <img src={arrow_icon} alt="" /> 
      {product.category} <img src={arrow_icon} alt="" /> 
      {product.name}
    </div>
  )
}

export default Breadcrum;