// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useCart } from './CartContext';
// import API_CONFIG, { getAuthHeader } from '../config/api.config';

// const ShopContext = createContext();

// export const ShopContextProvider = ({ children }) => {
//     const { dispatch, state } = useCart();
//     const [all_product, setAllProduct] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetchProducts();
//     }, []);

//     const fetchProducts = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANIMALS}`, {
//                 headers: {
//                     ...API_CONFIG.HEADERS,
//                     ...getAuthHeader()
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to fetch products');
//             }

//             const data = await response.json();
//             setAllProduct(data);
//             setError(null);
//         } catch (error) {
//             console.error('Error fetching products:', error);
//             setError('Failed to load products. Please try again later.');
//             setAllProduct([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const addToCart = (product) => {
//         if (product) {
//             dispatch({
//                 type: 'ADD_TO_CART',
//                 payload: {
//                     id: product.id,
//                     name: product.name,
//                     price: product.new_price || product.price,
//                     image: product.image,
//                     quantity: 1
//                 }
//             });
//         }
//     };

//     const getTotalCartItems = () => {
//         return state.items.reduce((total, item) => total + item.quantity, 0);
//     };

//     const getTotalCartAmount = () => {
//         return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
//     };

//     const contextValue = {
//         all_product,
//         loading,
//         error,
//         addToCart,
//         getTotalCartItems,
//         getTotalCartAmount,
//         cartItems: state.items,
//         refreshProducts: fetchProducts
//     };

//     return (
//         <ShopContext.Provider value={contextValue}>
//             {children}
//         </ShopContext.Provider>
//     );
// };

// export const useShop = () => {
//     const context = useContext(ShopContext);
//     if (!context) {
//         throw new Error('useShop must be used within a ShopContextProvider');
//     }
//     return context;
// };

// export { ShopContext };

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create and export the context
export const ShopContext = createContext();

export const ShopContextProvider = ({ children }) => {
    const [all_product, setAllProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            // const response = await axios.get('http://127.0.0.1:5000/api/animals', {
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Access-Control-Allow-Origin': '*'
            //     }
            // });
            const response = await axios.get('http://127.0.0.1:5000/api/animals', {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true // ✅ Ensures credentials (cookies, auth) are sent
            });
            

            setAllProduct(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please try again later.');
            setAllProduct([]);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        setCartItems(prev => {
            const existingItem = prev.find(item => item.id === product.id);
            if (existingItem) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const getTotalCartItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalCartAmount = () => {
        return cartItems.reduce((total, item) => total + (item.new_price * item.quantity), 0);
    };

    const contextValue = {
        all_product,
        loading,
        error,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartItems,
        getTotalCartAmount,
        refreshProducts: fetchProducts
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => {
    const context = useContext(ShopContext);
    if (!context) {
        throw new Error('useShop must be used within a ShopContextProvider');
    }
    return context;
};