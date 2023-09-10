import React from 'react';
import { Grid } from '@mui/material';
import AccordionComponent from './componets/AccordionComponent';
import ProductCardComponent from './ProductCardComponent';
import { ITEMS_PER_PAGE } from '../../constants';



const CountriesComponent = ({
    addToCart,
    countriesProducts,
    displayedProductsCount,
    openAccordion,
    handleAccordionClick,
    setDisplayedProductsCount,
    cartItems,
}) => {

    return (
        <div className="grid-container">
            <h1>Countries</h1>
            <div className="row">
                <div className="product-grid">
                    {Object.keys(countriesProducts).length > 0 ? (
                        <>
                        {Object.keys(countriesProducts)
                            .sort()
                            .map((countryName) => (
                            <div key={countryName} className="country-card">
                                <AccordionComponent
                                    key={countryName}
                                    countryName={countryName}
                                    openAccordion={openAccordion}
                                    handleAccordionClick={handleAccordionClick}
                                />
                            </div>
                            ))
                            .slice(0, displayedProductsCount)} {/* Display products up to displayedProductsCount */}
                        </>
                    ) : (
                        <p>No country products found.</p>
                    )}
                </div>
                {openAccordion && (
                <div className="row">
                    <Grid container spacing={2}>
                        {countriesProducts[openAccordion].slice(0, displayedProductsCount).map((product) => (
                            <Grid item key={product.id} xs={12} sm={6} md={4}>
                                <ProductCardComponent product={product} addToCart={addToCart} cartItems={cartItems} />
                            </Grid>
                        ))}
                    </Grid>
                </div>
            )}
            </div>
            
            

            {Object.keys(countriesProducts).length > displayedProductsCount && (
                <div className="load-more-button">
                <button onClick={() => setDisplayedProductsCount(displayedProductsCount + ITEMS_PER_PAGE)}>
                    View More
                </button>
                </div>
            )}
        </div>
    );
};

export default CountriesComponent;
