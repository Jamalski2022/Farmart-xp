import React from 'react'
import './NewsLetter.css'

const NewsLetter = () => {
  return (
    <div className='newsletter'>
      <h1>Get exclusive Deals On Your Email</h1>
      <p>Subscribe to our newsletter and stay updated</p>
      <div>
        <input type="email" placeholder='Your Email Id' />
        <button>Subsrcibe</button>
      </div>
    </div>
  )
}

export default NewsLetter
