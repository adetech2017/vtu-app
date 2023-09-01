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

    const countryNames = Object.keys(countriesProducts).sort();

    const renderOpenAccordionContent = (countryName) => (
        <div className="row">
            <Grid container spacing={2}>
                {countriesProducts[countryName].slice(0, displayedProductsCount).map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4}>
                        <ProductCardComponent
                            product={product}
                            addToCart={addToCart}
                            cartItems={cartItems}
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    );

    return (
        <div className="grid-container">
            <h1>Countries</h1>
            {countryNames.length > 0 ? (
                <div className="row">
                    {countryNames.map((countryName, index) => (
                        <div className="product-grid" key={countryName}>
                            <AccordionComponent
                                countryName={countryName}
                                openAccordion={openAccordion}
                                handleAccordionClick={handleAccordionClick}
                            />
                            {(index + 1) % 4 === 0 || index === countryNames.length - 1 ? (
                                <div className="row">
                                    {openAccordion === countryName && renderOpenAccordionContent(countryName)}
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No country products found.</p>
            )}
            {countryNames.length > displayedProductsCount && (
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