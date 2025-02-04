import React, { useContext, useState } from 'react'
import './Navbar.css'
import logo from '../assets/livestock-farming.png'
import cart from '../assets/carttt.png'
import { Link } from 'react-router-dom'
// import { ShopContext } from '../../Context/ShopContext'
import { useShop } from '../../Context/ShopContext'

const Navbar = () => {

  const [menu,setMenu] = useState("shop");
  const {getTotalCartItems}= useShop();

  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo} alt="" />
        <p>FARMART</p>
      </div>
      <ul className='nav-menu'>
        <li onClick={()=>{setMenu("shop")}}><Link style={{textDecoration: 'none'}} to='/'>HOME</Link>{menu==="shop"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("animals")}}><Link style={{textDecoration: 'none'}} to='/animals'>COW</Link>{menu==="animals"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("farmers")}}><Link style={{textDecoration: 'none'}} to='/farmers'>GOAT</Link>{menu==="farmers"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("cows")}}><Link style={{textDecoration: 'none'}} to='/cows'>CHICKEN</Link>{menu==="cows"?<hr/>:<></>}</li>
      </ul>
      <div className="nav-login-cart">
        <Link to='/login'><button>Login</button></Link>
        <Link to='/cart'><img src={cart} alt="" /></Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
    
    
  )
}

export default Navbar
