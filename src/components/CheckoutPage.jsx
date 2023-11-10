import React, { useState } from 'react';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import './CheckoutPage.css';
import deviceByModel from './deviceModelsData'; // Import the data
import getAuthToken from '../apiAuth';
import QRCode from "react-qr-code";
import { useNavigate } from 'react-router-dom';
import { FLW_PUBLIC_KEY } from '../constants';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import CheckoutSummary from './CheckoutSummary';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';






const CheckoutPage = ({ onCompleteOrder }) => {
    // Access the cart and cart-related functions from the CartContext
    const { cartItems, removeFromCart } = useCart();
    const [currentStep, setCurrentStep] = useState(1); // Initialize with the first step
    
    const [selectedDeviceType, setSelectedDeviceType] = useState('');
    const [selectedDeviceModel, setSelectedDeviceModel] = useState('');
    const [availableModels, setAvailableModels] = useState([]);

    const [loading, setLoading] = useState(false); // State for circular progress
    const [openModal, setOpenModal] = useState(false); // State for modal
    const [completeOrderData, setCompleteOrderData] = useState(null); // State to store order data
    const [selectedProductId, setSelectedProductId] = useState(null);


    const navigate = useNavigate();

    console.log('Received product items:', selectedProductId);


    const handleDeviceTypeChange = (e) => {
        const selectedDeviceType = e.target.value;
        setSelectedDeviceType(selectedDeviceType);

        // Get the models based on the selected device type from the imported data
        const availableModels = deviceByModel[selectedDeviceType] || [];
        setAvailableModels(availableModels);
        setSelectedDeviceModel('');
    };

    const isNextButtonVisible = selectedDeviceType && selectedDeviceModel;


    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePrevStep = () => {
        setCurrentStep(currentStep - 1);
    };


    // Step 2: Form fields
    const [privacyChecked, setPrivacyChecked] = useState(false);
    const [termsChecked, setTermsChecked] = useState(false);
    const [policyChecked, setPolicyChecked] = useState(false);


    // State variables for form inputs and validation
    const [formValues, setFormValues] = useState({
        selectedDeviceType: '',
        selectedDeviceModel: '',
        firstName: '',
        lastName: '',
        email: '',
        privacyChecked: false,
        termsChecked: false,
        policyChecked: false,
        cardNumber: '',
        cardName: '',
        cardExpiry: '',
        cardCvc: '',
    });


    const handleInputChange = (fieldName, value) => {    
        setFormValues((prevValues) => ({
            ...prevValues,
            [fieldName]: value,
        }));
    
        // Handle specific fields
        if (fieldName === 'email') {
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            console.log(isValidEmail);
            if (!isValidEmail) {
                // Handle invalid email address here (e.g., display an error message)
                toast.error('Invalid email address', {
                    position: 'top-center',
                    autoClose: 3000, // Close the toast after 3 seconds
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } else if (fieldName === 'firstName') {
          // Handle firstName field
        } else if (fieldName === 'lastName') {
          // Handle lastName field
        }
    };




    // Function to handle form submission
    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Validate the form input values for the current step
        if (currentStep === 1) {
            if (!formValues.selectedDeviceType || !formValues.selectedDeviceModel) {
                // Handle validation errors and show appropriate messages
                return;
            }
        } else if (currentStep === 2) {
            // Validate step 2 fields (firstName, lastName, email, checkboxes, etc.)
            if (!formValues.firstName || !formValues.lastName || !formValues.email) {
                // Handle validation errors and show appropriate messages
                return;
            }
            if (!formValues.privacyChecked || !formValues.termsChecked || !formValues.policyChecked) {
                // Handle validation errors for checkboxes and show appropriate messages
                return;
            }
        } else if (currentStep === 3) {
            // Validate step 3 fields (cardNumber, cardName, cardExpiry, cardCvc)
            if (!formValues.cardNumber || !formValues.cardName || !formValues.cardExpiry || !formValues.cardCvc) {
                // Handle validation errors and show appropriate messages
                return;
            }
        }

        // Handle form submission logic based on the current step
        if (currentStep === 1) {
            // Proceed to the next step
            setCurrentStep(currentStep + 1);
        } else if (currentStep === 2) {
            // Proceed to the next step or submit the form
            if (isNextButtonVisible) {
                setCurrentStep(currentStep + 1);
            } else {
                handlePlaceOrder();
            }
        } else if (currentStep === 3) {
            handlePlaceOrder();
        }
    };


    console.log('Received cart items:', cartItems);


    const getTotalAmount = () => {
        const totalAmount = cartItems.reduce((total, item) => {
            const itemPrice = parseFloat(item.price); // Convert price to a number if needed
            return total + itemPrice;
        }, 0);
        return totalAmount;
    };

    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charactersLength);
            result += characters.charAt(randomIndex);
        }
        return result;
    }
    
    // Usage:
    const txRef = generateRandomString(12); // Generates a 12-character random string
    console.log(txRef);


    // Initialize the config object for Flutterwave
    const flutterwaveConfig = {
        public_key: FLW_PUBLIC_KEY,
        tx_ref: Date.now().toString(),
        amount: getTotalAmount().toString(),
        currency: 'NGN',
        payment_options: 'card',
        customer: {
            email: formValues.email,
            //phone_number: formValues.phoneNumber,
            name: `${formValues.firstName} ${formValues.lastName}`,
        },
        customizations: {
            title: 'RoamTech Service',
            description: 'Payment for items in cart',
            logo: 'http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png',
        },
    };

    // Use the Flutterwave hook
    const handleFlutterPayment = useFlutterwave(flutterwaveConfig);

    // Function to handle placing an order
    const handlePlaceOrder = async () => {
        try {
            
            setLoading(true); // Start loading
            const authToken = await getAuthToken();

            // Make the API request with the authentication token and product IDs
            const orderRequest = {
                plan_id: selectedProductId, // You may need to determine the actual plan_id
            };

            if (selectedProductId === null) {
                // Show a toast error message
                toast.error('Please select a product before proceeding.', {
                    position: 'top-center',
                    autoClose: 3000, // Close the toast after 3 seconds
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }

            const orderResponse = await fetch('https://sandbox.worldroambuddy.com:3001/api/v1/products/orders/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authToken, // Include the authentication token in the request headers
                },
                body: JSON.stringify(orderRequest),
            });

            if (!orderResponse.ok) {
                throw new Error(`Failed to create the order: ${orderResponse.statusText}`);
            }

            const orderData = await orderResponse.json();
            const orderId = orderData.data.order_id;

            // Continue with the rest of the order placement logic
            const completeOrderRequest = {
                order_id: orderId,
                email: formValues.email, // Use the dynamic customerEmail value
            };


            // Continue with Flutterwave payment using the hook
            handleFlutterPayment({
                callback: async (response) => {
                    console.log(response);
                    closePaymentModal(); // This will close the modal programmatically

                    if (response.status === 'successful') {
                        // Payment was successful, proceed with completing the order
                        try {
                            // Additional logic after payment success
                            const completeOrderResponse = await fetch('https://sandbox.worldroambuddy.com:3001/api/v1/products/orders/complete', {
                                method: 'POST',
                                headers: {
                                'Content-Type': 'application/json',
                                Authorization: authToken,
                                },
                                body: JSON.stringify(completeOrderRequest),
                            });

                            if (!completeOrderResponse.ok) {
                                throw new Error(`Failed to complete the order: ${completeOrderResponse.statusText}`);
                            }

                            const completeOrder = await completeOrderResponse.json();
                            setCompleteOrderData(completeOrder);

                            console.log('Order placed successfully!', completeOrder);
                            setOpenModal(true);
                
                            removeFromCart(selectedProductId);
                            navigate('/success');
                        } catch (error) {
                            console.error('Error completing the order:', error);
                            // Handle errors related to completing the order here
                        }
                    } else {
                        // Payment failed, handle accordingly
                        //handlePaymentFailure(response.message);
                    }
                },
                onClose: () => {
                    // Handle the case when the user closes the payment modal
                    console.log('Payment modal closed.');
                },
            });
            
            setLoading(false); // Stop loading
            
        } catch (error) {
            console.error('Error placing the order:', error);
            setLoading(false); 
            // Handle errors here
        }
    };






    return (
        <div className="checkout-page">
            <div className="shipping-info">
                <div className="step-indicator">
                    <div className={`step ${currentStep >= 1 ? 'completed' : ''}`}>
                        <div className="step-number">1</div>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${currentStep >= 2 ? 'completed' : ''}`}>
                        <div className="step-number">2</div>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${currentStep >= 3 ? 'completed' : ''}`}>
                        <div className="step-number">3</div>
                    </div>
                </div>
                <form onSubmit={handleFormSubmit}>
                    {currentStep === 1 && (
                        <div className="shipping-infos">
                            <h2>Step 1: Select Device</h2>
                            <div className='row'>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className='form-label' htmlFor="deviceType">Select Device:</label>
                                        <select
                                            id="deviceType"
                                            name="deviceType"
                                            value={selectedDeviceType}
                                            onChange={handleDeviceTypeChange}
                                            className='form-select'
                                        >
                                            <option value="">Select Device Type</option>
                                            <option value="Android">Android</option>
                                            <option value="iPhone">iPhone</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className='form-label' htmlFor="deviceModel">Select Device Model:</label>
                                        <select
                                            id="deviceModel"
                                            name="deviceModel"
                                            value={selectedDeviceModel}
                                            onChange={(e) => setSelectedDeviceModel(e.target.value)}
                                            className='form-select'
                                        >
                                            <option value="">Select Device Model</option>
                                            {availableModels.map((model) => (
                                                <option key={model} value={model}>
                                                    {model}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {isNextButtonVisible && (
                                    <button type="button" className="btn btn-info" onClick={handleNextStep}>
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="billing-info">
                            <h2>Step 2: Basic Details</h2>
                            {/* Billing information form */}
                            <div className='row'>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className='form-label' htmlFor="firstName">First Name:</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formValues.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            required
                                            className='form-control'
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className='form-label' htmlFor="lastName">Last Name:</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formValues.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            required
                                            className='form-control'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-8">
                                    <div className="form-group">
                                        <label className='form-label' htmlFor="email">Email:</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formValues.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            required
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-check checkbox-xl">
                                {/* <label>Privacy Policy:</label> */}
                                <input
                                    type="checkbox"
                                    id="privacy"
                                    name="privacy"
                                    checked={privacyChecked}
                                    onChange={() => setPrivacyChecked(!privacyChecked)}
                                    required
                                    className='form-check-input'
                                />
                                <label className='form-check-label' htmlFor="privacy">
                                    Acknowledge our Privacy Policy
                                </label>
                            </div>
                            <div className="form-check checkbox-xl">
                                {/* <label>Terms and Conditions:</label> */}
                                <input
                                    type="checkbox"
                                    id="terms"
                                    name="terms"
                                    checked={termsChecked}
                                    onChange={() => setTermsChecked(!termsChecked)}
                                    required
                                    className='form-check-input'
                                />
                                <label className='form-check-label' htmlFor="terms">
                                    I agree with the Terms and conditions
                                </label>
                            </div>
                            <div className="form-check checkbox-xl">
                                {/* <label>Acceptable Use Policy:</label> */}
                                <input
                                    type="checkbox"
                                    id="policy"
                                    name="policy"
                                    checked={policyChecked}
                                    onChange={() => setPolicyChecked(!policyChecked)}
                                    required
                                    className='form-check-input'
                                />
                                <label className='form-check-label' htmlFor="policy">
                                    I accept that the data plans are not refundable once I purchase them.
                                </label>
                            </div>
                                {/* <button onClick={handlePrevStep}>Previous</button>
                                <button type="submit" disabled={!privacyChecked || !termsChecked || !policyChecked}>Next</button> */}
                            
                            <div>
                                <button className='btn btn-secondary' onClick={handlePrevStep}>Previous</button>
                                <button className='btn btn-info' onClick={handleNextStep}>Next</button>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="confirm-order">
                            <h2>Step 3: Confirm Order</h2>
                            {/* Order confirmation details */}
                            
                            <CheckoutSummary
                                selectedDeviceType={selectedDeviceType}
                                selectedDeviceModel={selectedDeviceModel}
                                firstName={formValues.firstName}
                                lastName={formValues.lastName}
                                email={formValues.email}
                            />
                            
                            <div className='card-body'>
                                <button className='btn btn-secondary' onClick={handlePrevStep}>Previous</button>
                                <button className='btn btn-info' onClick={handlePlaceOrder}>Place Order</button>
                                
                            </div>
                        </div>
                    )}

                    {/* Display a progress indicator (optional) */}
                    {/* <div className="step-indicator">
                        Step {currentStep} of 3
                    </div> */}
                </form>
            </div>


            <div className="cart-details">
                <h1>Checkout</h1>
                {loading ? ( // Display circular progress if loading
                    <div className="circular-progress-container">
                        <CircularProgress />
                    </div>
                ) : (
                    cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <p>Your cart is empty. <Link to="/">Continue shopping</Link></p>
                        </div>
                    ) : (
                        <div>
                            <table className="cart-table">
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Price</th>
                                        <th colSpan="2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item.id} className={item.id === selectedProductId ? 'selected-item' : ''}>
                                            <td>{item.name}</td>
                                            <td>${item.price}</td>
                                            <td>
                                                <button onClick={() => removeFromCart(item.id)} className="remove-button">Remove</button>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        setSelectedProductId(item.id);
                                                        
                                                    // Optionally, you can display a message or change the style of the selected item here
                                                    }}
                                                    className={`select-button ${item.id === selectedProductId ? 'selected' : ''}`}
                                                >
                                                    {item.id === selectedProductId ? 'Selected' : 'Select'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <p style={{ fontWeight: 'bold', fontSize: '20px'}}>Total Amount: ${getTotalAmount()}</p>
                            {/* <Link to="/checkout/confirmation">
                                <button>Proceed to Payment</button>
                            </Link> */}
                        </div>
                    )
                )}
            </div>
            {/* Modal to display completeOrderData */}
            <Dialog 
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                >
                <DialogTitle id="modal-title">Order Complete</DialogTitle>
                <DialogContent>
                    {completeOrderData ? (
                        <DialogContentText id="modal-description">
                            <Typography variant="h6">Order ID: {completeOrderData.data.order_id}</Typography>
                            <Typography variant="body1">Order Status: {completeOrderData.data.order_status}</Typography>
                            <Typography variant="body1">Email: {completeOrderData.data.email}</Typography>
                            {/* Display the QR code as an image */}
                            {/* <img src={completeOrderData.data.qrcode_url} alt="QR Code" /> */}
                            <Typography variant="body1">APN: {completeOrderData.data.apn}</Typography>
                            <Typography variant="body1">Data Roaming: {completeOrderData.data.data_roaming}</Typography>
                            <Typography variant="body1">ICCID: {completeOrderData.data.iccid}</Typography>
                            <Typography variant="body1">Plan Name: {completeOrderData.data.plan.name}</Typography>
                            <Typography variant="body1">Plan Price: ${completeOrderData.data.plan.price}</Typography>
                            <Typography variant="body1">Plan Data: {completeOrderData.data.plan.data} GB</Typography>
                            <Typography variant="body1">Plan Validity: {completeOrderData.data.plan.validity} days</Typography>
                            <Typography variant="body1">Plan Region: {completeOrderData.data.plan.region}</Typography>
                            <Typography variant="body1">Plan Type: {completeOrderData.data.plan.planType}</Typography>
                            {completeOrderData.data.qr_code && (
                                <div>
                                    <Typography variant="body1">QR Code:</Typography>
                                    <QRCode value={completeOrderData.data.qr_code} />
                                </div>
                            )}
                            <Typography variant="body1">Countries Included: {completeOrderData.data.plan.countries.map((country) => country.country_name).join(', ')}</Typography>
                        </DialogContentText>
                    ) : (
                        <Typography variant="body1">Loading order data...</Typography>
                    )}
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} variant="contained" color="primary">
                        Close
                    </Button>
                    {/* Add additional actions or buttons as needed */}
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default CheckoutPage;
