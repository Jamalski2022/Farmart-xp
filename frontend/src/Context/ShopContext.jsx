// src/Context/ShopContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create and export the context
export const ShopContext = createContext();

export const ShopContextProvider = ({ children }) => {
    const [all_product, setAllProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);

    // Fetch products when the component mounts
    useEffect(() => {
        fetchProducts();
    }, []);

    // Function to fetch products from the backend
    const fetchProducts = async () => {
        try {
            setLoading(true);
            // Fetch animals from the backend
            const response = await axios.get('http://127.0.0.1:5000/api/animals', {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            // Format the products to ensure consistent structure
            const formattedProducts = response.data.map(animal => ({
                id: animal.id,
                name: animal.name,
                category: animal.category,
                image: animal.image_url || '/default-animal-image.png', // Fallback image
                new_price: parseFloat(animal.price),
                old_price: parseFloat(animal.price * 1.2), // Optional: Add markup for old price
                description: animal.description || 'No description available'
            }));

            setAllProduct(formattedProducts);
            setError(null);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please try again later.');
            setAllProduct([]);
        } finally {
            setLoading(false);
        }
    };

    // Add to cart functionality
    const addToCart = (product) => {
        setCartItems(prev => {
            // Check if the item already exists in the cart
            const existingItem = prev.find(item => item.id === product.id);
            
            if (existingItem) {
                // If item exists, increase quantity
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            
            // If item doesn't exist, add new item with quantity 1
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    // Remove from cart functionality
    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    // Update cart item quantity
    const updateCartItemQuantity = (productId, newQuantity) => {
        setCartItems(prev => 
            prev.map(item => 
                item.id === productId 
                    ? { ...item, quantity: newQuantity }
                    : item
            ).filter(item => item.quantity > 0)
        );
    };

    // Calculate total number of items in cart
    const getTotalCartItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Calculate total cart amount
    const getTotalCartAmount = () => {
        return cartItems.reduce((total, item) => 
            total + (item.new_price * item.quantity), 0
        );
    };

    // Clear cart functionality
    const clearCart = () => {
        setCartItems([]);
    };

    // Context value to be provided
    const contextValue = {
        all_product,
        loading,
        error,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        getTotalCartItems,
        getTotalCartAmount,
        clearCart,
        refreshProducts: fetchProducts
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {children}
        </ShopContext.Provider>
    );
};

// Custom hook to use the ShopContext
export const useShop = () => {
    const context = useContext(ShopContext);
    if (!context) {
        throw new Error('useShop must be used within a ShopContextProvider');
    }
    return context;
};