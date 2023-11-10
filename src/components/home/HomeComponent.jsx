import React from 'react';
import Slider from './slider/Slider';
import SearchBar from './slider/SearchBar';
import TabNavigationComponent from './componets/TabNavigationComponent';
import CountriesComponent from './CountriesComponent';
import RegionsComponent from './RegionsComponent';
import GlobalPlansComponent from './GlobalPlansComponent';




const HomeComponent = ({
    activeTab,
    setActiveTab,
    countriesProducts,
    displayedProductsCount,
    openAccordion,
    handleAccordionClick,
    setDisplayedProductsCount,
    regionsProducts,
    globalPlanProducts,
    handleSearch,
    addToCart,
    cartItems,
    filteredProducts = [],
}) => {


    const imageUrls = [
        process.env.PUBLIC_URL + '/images/airport.jpg',
        process.env.PUBLIC_URL + '/images/wordl.jpg',
        process.env.PUBLIC_URL + '/images/world2.jpg',
    ];

    return (
        <div className='app'>
            <Slider
            imageUrls={imageUrls}
            heading='Welcome to e-Sim Store'
            subheading='Explore Our e-Sim Services around the world'
            />
            <SearchBar onSearch={handleSearch} />

            {/* Conditionally render filteredProducts */}
            {filteredProducts.length > 0 && (
                <div>
                    <h2>Filtered Products:</h2>
                    <ul>
                        {filteredProducts.map((product) => (
                            <li key={product.id}>{product.name}</li>
                        ))}
                    </ul>
                </div>
            )}


            <div>
                <TabNavigationComponent activeTab={activeTab} setActiveTab={setActiveTab} />
        
                {activeTab === 'countries' && (
                    <CountriesComponent
                    addToCart={addToCart}
                    countriesProducts={countriesProducts}
                    displayedProductsCount={displayedProductsCount}
                    openAccordion={openAccordion}
                    handleAccordionClick={handleAccordionClick}
                    setDisplayedProductsCount={setDisplayedProductsCount}
                    cartItems={cartItems}
                    filteredProducts={filteredProducts}
                    />
                )}
        
                {activeTab === 'regions' && (
                    <RegionsComponent regionsProducts={regionsProducts} />
                )}
        
                {activeTab === 'global' && (
                    <GlobalPlansComponent globalPlanProducts={globalPlanProducts} />
                )}
    
            </div>
        </div>
    );
};

export default HomeComponent;