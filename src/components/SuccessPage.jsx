import React from 'react';
import { Typography } from '@mui/material';
import QRCode from "react-qr-code";



const SuccessPage = ({ completeOrderData }) => {
    return (
        <div className="success-page">
            <Typography variant="h4">Order Confirmation</Typography>
            <Typography variant="body1">Order ID: {completeOrderData.data.order_id}</Typography>
            <Typography variant="body1">Order Status: {completeOrderData.data.order_status}</Typography>
            <Typography variant="body1">Email: {completeOrderData.data.email}</Typography>
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
        </div>
    );
};

export default SuccessPage;
