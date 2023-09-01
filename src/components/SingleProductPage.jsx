import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import getAuthToken from '../apiAuth';







const SingleProductPage = ( addToCart, cartItems) => {
    const { productId } = useParams();
    const [productDetails, setProductDetails] = useState(null);
    //const [cartItems, setCartItems] = useState([]);


    useEffect(() => {
        const fetchProductDetails = async () => {
        try {
            const authToken = await getAuthToken();
            const response = await fetch(`https://sandbox.worldroambuddy.com:3001/api/v1/products/${productId}`, {
                headers: {
                    'Authorization': authToken,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }

            const productData = await response.json();
            console.log('Product details', productData);
            setProductDetails(productData.data);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

        fetchProductDetails();
    }, [productId]);


    // const handleAddToCart = () => {
    //     // Check if the product is already in the cart
    //     const productExists = cartItems.some(item => item.id === productDetails.id);

    //     if (productExists) {
    //         // Show error message or any appropriate UI
    //         console.log('Product already in cart');
    //     } else {
    //         // Add the product to the cart
    //         addToCart(productDetails);
    //         console.log('Product added to cart');
    //     }
    // };

    const handleBuyNow = () => {
        addToCart(productDetails);
        // Implement navigation to checkout or any other desired action
    };


    return (
        <div className="row">
            
                <div className="product-details col-md-9">
                    {productDetails ? (
                        <div>
                            <h2>{productDetails.name}</h2>
                            <h2>Validity: {productDetails.validity} Days</h2>
                            <h2>Data: {productDetails.data}GB</h2>
                            <h2>Price: ${productDetails.price}</h2>
                            <p>{productDetails.description}</p>
                        </div>
                    ) : (
                        <p>Loading product details...</p>
                    )}

                    <div className="countries-list">
                        {productDetails && productDetails.countries.length > 0 ? (
                            <div className="countries-row">
                                {productDetails.countries.map((country) => (
                                    <div className="country-card" key={country.id}>
                                        <p>{country.country_name}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No countries available.</p>
                        )}
                    </div>
                </div>

                <div className="cart-sidebar col-md-3">
                {productDetails && (
                    <div>
                        <h2>Product Details</h2>
                        <p>Name: {productDetails.name}</p>
                        <p>Price: ${productDetails.price}</p>
                        <button onClick={handleBuyNow}>Buy Now</button>
                    </div>
                )}
            </div>

            
        </div>
    );
};

export default SingleProductPage;
