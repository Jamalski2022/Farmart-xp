import React from 'react'
import './Hero.css'
import hand_icon from '../assets/milking.png'
import arrow_icon from '../assets/right-arrow.png'
import farmer_image from '../assets/farmer.jpg'

const Hero = () => {
  return (
    <div className='hero'>
      <div className="hero-left">
        <h2>NEW STOCK ARRIVING SOON</h2>
        <div>
            <div className='hero-hand-icon'>
              <p>Healthy</p>
              <img src={hand_icon} alt="" />
            </div>
            <p>Animals</p>
            <p>Ready for sale</p>
        </div>
        <div className="hero-latest-btn">
            <div>Healthy Livestock</div>
            <img src={arrow_icon} alt="" />
        </div>
      </div>
      <div className="hero-right">
         <img src={farmer_image} alt="" style={{ width: '500px', height: '550px' ,objectFit:'cover', marginRight:'10px' ,marginLeft:'0px', borderRadius:"20px",marginTop:'5px' }} />
      </div>

    </div>
  )
}

export default Hero
