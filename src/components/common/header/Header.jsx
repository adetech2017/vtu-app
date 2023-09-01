import React from 'react';
import './Header.css'; 
import { Link } from 'react-router-dom';
import { Button, Menu, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';






const Header = ({ cartItems, removeFromCart }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };


    return (
        <header className="header">
            <div className="logo">
                <Link to="/">Your Logo</Link>
            </div>
            <nav className="nav">
                <ul className="navList">
                    <li className="navItem">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="navItem">
                        <Link to="/products">Products</Link>
                        
                    </li>
                    <li className="navItem">
                        <Button
                            aria-controls="cart-menu"
                            aria-haspopup="true"
                            onClick={handleMenuOpen}
                        >
                            Cart ({cartItems.length})
                        </Button>
                        <Menu
                            id="cart-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <div className="cart-dropdown">
                                <ul className="cart-list">
                                    {cartItems.map((item) => (
                                        <MenuItem key={item.id} className="cart-item" onClick={handleMenuClose}>
                                            {item.name} - ${item.price}
                                            <DeleteIcon onClick={() => removeFromCart(item.id)} 
                                                style={{ color: 'red', cursor: 'pointer' }}
                                            />
                                        </MenuItem>
                                    ))}
                                </ul>
                                <hr />
                                <div className="checkout-button-container">
                                    <Link to="/checkout">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                        >
                                            Checkout
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Menu>
                    </li>
                    {/* Add more navigation items as needed */}
                </ul>
            </nav>
        </header>
    )
}

export default Header