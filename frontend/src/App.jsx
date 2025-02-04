import { useState } from 'react'
import './App.css'
import Navbar from './Components/Navbar/Navbar'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import LoginSignup from './Pages/LoginSignup';
import Cart from './Pages/Cart';
import Shop from './Pages/Shop';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/assets/antony.jpg'
import women_banner from './Components/assets/messii.jpg'
import kid_banner from './Components/assets/riacharlison.jpg'
import { ShopContextProvider } from './Context/ShopContext';
import { ProtectedRoute } from './utils/ProtectedRoute';
import { CartProvider } from './Context/CartContext';
import  CheckoutForm   from './Components/CheckoutForm';  // adjust the path as needed
import FarmerDashboard from './Components/FarmerDashoard';


function App() {
  const [count, setCount] = useState(0)

  return (
      <CartProvider>
        <ShopContextProvider>
        <BrowserRouter>
        <Navbar />
        <div className='main-container'>
        <Routes>
          <Route path='/' element={<Shop/>}/>
          <Route path='/animals' element={<ShopCategory banner={men_banner} category="animal"/>}/>
          <Route path='/farmers' element={<ShopCategory banner={women_banner} category="farmer"/>}/>
          <Route path='/cows' element={<ShopCategory banner={kid_banner} category="cow"/>}/>
          
          <Route path='/product/:productId' element={<Product/>}/>
          <Route path='/cart' element={<ProtectedRoute><Cart/></ProtectedRoute>}/>
          <Route path='/checkout' element={<ProtectedRoute><CheckoutForm/></ProtectedRoute>}/>
          <Route path='/login' element={<LoginSignup/>}/>
          <Route path="/farmer/dashboard" element={<ProtectedRoute><FarmerDashboard/></ProtectedRoute>}/>


        </Routes>
        </div>
        <Footer/>


        </BrowserRouter>
        </ShopContextProvider>
      </CartProvider>
      
      
    
  )
}

export default App
