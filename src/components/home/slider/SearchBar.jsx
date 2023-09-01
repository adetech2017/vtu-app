import React, { useState } from 'react';
import './SearchBar.css'




const SearchBar = ({ onSearch }) => {

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        if (searchTerm.trim() !== '') {
            onSearch(searchTerm);
        }
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value); // Call the onSearch function as the user types
    };



    return (
        <div className="search-bar-container">
            <h2>Search for Data Plan by Country:</h2>
            <input
                type="text"
                placeholder="Search by country name"
                value={searchTerm}
                onChange={handleInputChange} // Listen to the input event
                className="search-input"
                autoFocus
            />
            <button onClick={handleSearch} className="search-button">Search</button>
        </div>
    );
};

export default SearchBar;


