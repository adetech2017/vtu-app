import React from 'react';




const CheckoutSummary = ({
    selectedDeviceType,
    selectedDeviceModel,
    firstName,
    lastName,
    email,
}) => {
    return (
        <div className="checkout-summary">
            <h2>Summary</h2>
            <p>Device Type: {selectedDeviceType}</p>
            <p>Device Model: {selectedDeviceModel}</p>
            <p>First Name: {firstName}</p>
            <p>Last Name: {lastName}</p>
            <p>Email: {email}</p>
        </div>
    );
};

export default CheckoutSummary;
