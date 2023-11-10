import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../CartContext';




const ProductCardComponent = ({ product }) => {

    const { cartItems, addToCart } = useCart();


    const handleAddToCart = () => {
        if (cartItems.some(item => item.id === product.id)) {
            toast.error(`${product.name} is already in the cart.`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        } else {
            addToCart(product); // Call the addToCart function passed as a prop
            toast.success(`${product.name} added to cart successfully!`, {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };



    return (
        <Card key={product.id}>
            <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" style={{ marginBottom: '10px' }}>
                    {product.name}
                    <hr />
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div>
                        <Typography>
                            <LanguageIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: '10px' }} />
                            {product.data} GB
                        </Typography>
                    </div>
                    <div style={{ backgroundColor: '#0056b3', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>
                        ${product.price}
                    </div>
                </div>
                <Typography style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                    Internet Traffic
                </Typography>
                <Typography style={{ display: 'flex', alignItems: 'center' }}>
                    <LanguageIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: '10px' }} />
                    {product.validity} Days
                    <Link to={`/products/${product.id}`} style={{ marginLeft: 'auto' }}>
                        <Button 
                        variant="outlined"
                        color="primary"
                        size="small"
                        style={{ marginLeft: 'auto' }}
                        >
                        View Product
                        </Button>
                    </Link>
                </Typography>
                <Typography style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                    Duration
                </Typography>
            </CardContent>
            <div className="add-to-cart-button" style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleAddToCart}
                    disabled={cartItems.some(item => item.id === product.id)}
                >
                    {cartItems.some(item => item.id === product.id) ? 'In Cart' : 'Add to Cart'}
                </Button>
            </div>
        </Card>
    );
};

export default ProductCardComponent;
