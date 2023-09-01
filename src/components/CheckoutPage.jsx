import React from 'react';
import { Button, Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const CheckoutPage = ({ cartItems }) => {

    const getTotalAmount = () => {
        const totalAmount = cartItems.reduce((total, item) => {
            const itemPrice = parseFloat(item.price); // Convert price to a number if needed
            return total + itemPrice;
        }, 0);
        return totalAmount;
    };


    

    return (
        <div className="checkout-page">
            <Typography variant="h4" gutterBottom>
                Checkout
            </Typography>
            <Paper elevation={3} className="checkout-paper">
                {cartItems.length > 0 ? (
                    <div className="checkout-items">
                        <Typography variant="h6">Your Cart:</Typography>
                        <ul>
                            {cartItems.map((item) => (
                                <li key={item.id}>
                                    {item.name} - ${item.price}
                                </li>
                            ))}
                        </ul>
                        <Typography variant="h6">Total Amount: ${getTotalAmount()}</Typography>
                        <Link to="/checkout/confirm">
                            <Button variant="contained" color="primary">
                                Confirm Order
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <Typography variant="subtitle1">Your cart is empty.</Typography>
                )}
            </Paper>
        </div>
    );
};

export default CheckoutPage;
