import React from 'react';
import './ProductCard.css'; // Import the CSS file for ProductCard




const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <h2>{product.name}</h2>
            <p className="price">Price: ${product.price}</p>
            <p>Data: {product.data} GB</p>
            <p>Validity: {product.validity} days</p>
            <p>Region: {product.region}</p>
            <p>Plan Type: {product.planType}</p>
            <ul>
                <li>Available Countries:</li>
                {product.countries.map((country) => (
                <li key={country.id}>{country.country_name}</li>
                ))}
            </ul>
            <div className="buttons">
                <button className="checkout-button">Checkout</button>
                <button className="view-offer-button">View Offer</button>
            </div>
        </div>
    );
};

export default ProductCard;
