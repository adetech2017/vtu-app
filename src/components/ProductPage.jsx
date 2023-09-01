import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';




const ProductPage = () => {
    const { productId } = useParams();

    // Fetch the product details using productId and display them here

    return (
        <div>
            {/* Display product details */}
            <h1>Hello products</h1>
        </div>
    );
};

export default ProductPage;