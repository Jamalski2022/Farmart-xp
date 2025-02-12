import React from 'react';
import './CSS/ShopCategory.css';
import { useShop } from '../Context/ShopContext';
import dropdown_icon from '../Components/assets/down-arrow.png';
import Item from '../Components/Item/Item';

const ShopCategory = (props) => {
    const { all_product, loading, error } = useShop();

    // Filter products for current category
    const categoryProducts = all_product?.filter(item => item.category === props.category) || [];
    const categoryProductCount = categoryProducts.length;

    if (loading) {
        return <div className="shop-category-loading">Loading...</div>;
    }

    if (error) {
        return <div className="shop-category-error">{error}</div>;
    }

    return (
        <div className='shop-category'>
            <img 
                className='shopcategory-banner' 
                src={props.banner} 
                alt={`${props.category} category banner`}
                style={{ 
                    width: '1200px', 
                    height: '300px', 
                    objectFit: 'cover', 
                    borderRadius: "20px", 
                    marginTop: '10px' 
                }} 
            />
            
            {categoryProductCount > 0 ? (
                <>
                    <div className="shopcategory-indexSort">
                        <p>
                            <span>Showing 1-{categoryProductCount}</span> out of {categoryProductCount} products
                        </p>
                        <div className="shopcategory-sort">
                            Sort by <img src={dropdown_icon} alt="dropdown icon" />
                        </div>
                    </div>
                    
                    <div className="shopcategory-products">
                        {categoryProducts.map((item) => (
                            <Item 
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                image={item.image}
                                new_price={item.new_price}
                                old_price={item.old_price}
                            />
                        ))}
                    </div>

                    <div className="shopcategory-loadmore">
                        Explore More
                    </div>
                </>
            ) : (
                <div className="no-products-message">
                    No products found in this category
                </div>
            )}
        </div>
    );
};

export default ShopCategory;