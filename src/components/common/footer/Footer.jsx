import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
        <p className="text">&copy; {new Date().getFullYear()} Your Company</p>
        </footer>
    );
};

export default Footer;
