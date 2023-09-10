import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import getAuthToken from '../apiAuth';
import './SingleProductPage.css';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import countryFlagMapping from './countryFlagMapping';




const SingleProductPage = ( addToCart, cartItems) => {
    const { productId } = useParams();
    const [productDetails, setProductDetails] = useState(null);
    const [quantity, setQuantity] = useState(1);
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




    const handleBuyNow = () => {
        addToCart(productDetails);
        // Implement navigation to checkout or any other desired action
    };

    const handleQuantityChange = (event) => {
        const newQuantity = parseInt(event.target.value, 10);
        setQuantity(newQuantity);
    };

    // State to manage the accordion open/close state
    const [isAccordionOpen, setAccordionOpen] = useState(false);

    // Function to toggle the accordion
    const toggleAccordion = () => {
        setAccordionOpen(!isAccordionOpen);
    };


    return (
        <div className="single-product-page">
            
            <div className="product-details">
                {productDetails ? (
                    <div className="product-details-container">
                        <div>
                            <table style={{ width: '100%' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ fontWeight: 'bold', fontSize: '20px'}}>{productDetails.name}</td>
                                        <td style={{ fontWeight: 'bold', fontSize: '16px'}}>Validity</td>
                                        <td style={{ fontWeight: 'bold', fontSize: '16px'}}>Data</td>
                                        <td style={{ fontWeight: 'bold', fontSize: '16px'}}>Price</td>
                                    </tr>

                                    <tr>
                                        <td></td>
                                        <td style={{ color: 'green', fontWeight: 'bold', fontSize: '22px'}}>{productDetails.validity} Days</td>
                                        <td style={{ color: 'green', fontWeight: 'bold', fontSize: '22px'}}>{productDetails.data}GB</td>
                                        <td style={{ color: 'green', fontWeight: 'bold', fontSize: '22px'}}>${productDetails.price}</td>
                                    </tr>

                                </tbody>
                            </table>
                            <p>{productDetails.description}</p>
                        </div>
                    </div>
                ) : (
                    <p>Loading product details...</p>
                )}

                <div style={{ marginTop: '50px' }}>
                    <h3>Service Description</h3>
                    <div className="list-container">
                        <ul>
                            <li>INSTANT DELIVERY BY EMAIL - READY TO CONNECT</li>
                            <li>This is a data-only eSIM. It does not come with a phone number.</li>
                            <li>Simply scan the QR code to download and use the eSIM. No other activation or registration steps needed.</li>
                            <li>One-time prepaid package. No auto-renewals, no contracts.</li>
                            <li>Full data speeds - no daily limits, no throttling. Mobile hotspot is supported.</li>
                            <li>Usable on all unlocked iOS and Android devices supporting eSIM technology. If in doubt, please check the FAQ section.</li>
                            <li>Please start using the eSIM no more than 3 months after purchase.</li>
                        </ul>
                    </div>
                </div>
                <div style={{ marginTop: '50px' }}>
                    <h3>Works in</h3>
                    <div className="workin-container">
                        {productDetails && productDetails.countries.length > 0 ? (
                            <div className="countries-row">
                                {productDetails.countries.map((country) => (
                                    <div className="country-card" key={country.id}>
                                        {country.country_name} 
                                        <img
                                            src={countryFlagMapping[country.country_name]}
                                            alt={country.country_name}
                                            className="country-flag"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No countries available.</p>
                        )}
                    </div>
                </div>

                <div className="countries-list">
                    
                </div>
            </div>
            
            <div className="cart-sidebar">
                {productDetails && (
                    <div className="cart-item">
                        <table style={{ width: '100%' }}>
                            <tbody>
                                <tr>
                                    <td style={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'left'}}>{productDetails.name}</td>
                                    <td>Quantity x 1</td>
                                    <td style={{ color: 'green', fontWeight: 'bold', fontSize: '22px'}}>
                                        ${productDetails.price}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'left'}}>{productDetails.planType} x 1</td>
                                    <td> </td>
                                    <td style={{ color: 'green', fontWeight: 'bold', fontSize: '22px'}}>Free</td>
                                </tr>
                                <tr>
                                    <td colSpan="3"><hr /></td> {/* Use colSpan to span all three columns */}
                                </tr>
                                <tr>
                                    <td style={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'left'}}>Total</td>
                                    <td> </td>
                                    <td style={{ color: 'green', fontWeight: 'bold', fontSize: '22px'}}>${quantity * productDetails.price}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3"><hr /></td> {/* Use colSpan to span all three columns */}
                                </tr>
                            </tbody>
                        </table>
                        <button className="buy-now-button" onClick={handleBuyNow} style={{ width: '100%' }}>
                            Buy Now
                        </button>
                    </div>
                )}

                {/* Frequently Asked Questions */}
                <div className="faq-section" style={{ marginTop: '20px' }}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}>
                            <Typography>Which Devices are e-SIM Capable?</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <p>
                            iPhone XR, XS, 11, 12, 13 and SE 2020 series; Google Pixel 3 and later models; 
                            Samsung S20 and Note 20 series, Fold and Flip; Huawei P40 and P40 pro; 
                            Motorola Razr; iPads:10.2, Air, Mini 2019, Pro 11, Pro 12.9. 
                            Smartwatches with eSIM capability (except Apple Watch) are also supported
                            </p>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}>
                            <Typography>Can I use my physical SIM along with the eSIM?</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <p>
                            Yes! With dual-SIM functionality you can have both your physical SIM and eSIM active at the same time.
                            </p>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </div>

            
        </div>
    );
};

export default SingleProductPage;
