import React, { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom';
import Header from '../src/components/common/header/Header'
import Footer from '../src/components/common/footer/Footer'
import getAuthToken from './apiAuth';
import { API_URL } from './constants';
import HomeComponent from '../src/components/home/HomeComponent';
import SingleProductPage from './components/SingleProductPage';
import CheckoutPage from './components/CheckoutPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from '../src/components/CartContext';
import SuccessPage from './components/SuccessPage'; 


const App = () => {
    const [countriesProducts, setCountriesProducts] = useState([]);
    const [regionsProducts, setRegionsProducts] = useState([]);
    const [globalPlanProducts, setGlobalPlanProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('countries');
    
    const [openAccordion, setOpenAccordion] = useState(null);
    const ITEMS_PER_PAGE = 16;
    const [cartItems, setCartItems] = useState([]);
    const [displayedProductsCount, setDisplayedProductsCount] = useState(ITEMS_PER_PAGE);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [completeOrderData, setCompleteOrderData] = useState(null);

    const addToCart = (product) => {
        setCartItems((prevCartItems) => [...prevCartItems, product]);
    };

    const removeFromCart = (productId) => {
        setCartItems(prevCartItems => prevCartItems.filter(item => item.id !== productId));
    };


    const handleAddToCart = (product) => {
        setCartItems(prevCartItems => [...prevCartItems, product]);
    };


    const handleAccordionClick = (accordionName) => {
        if (accordionName === openAccordion) {
            setOpenAccordion(null);
        } else {
            setOpenAccordion(accordionName);
        }
    };


    const fetchProducts = async (searchTerm) => {
        try {
            const authToken = await getAuthToken();
            const response = await fetch(API_URL, {
                headers: {
                    'Authorization': authToken,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const responseData = await response.json();
            console.log('API response:', responseData);
            console.log(process.env.FLW_SECRET_KEY);

            if (responseData.code === 200 && Array.isArray(responseData.data)) {
                const regionalProducts = responseData.data.filter(product => product.isRegional);
                const countryProducts = responseData.data.filter(product => !product.isRegional && product.countries.length > 0);
                const globalPlanProducts = responseData.data.filter(product => !product.isRegional && product.global_plan);


                // Filter products based on search term
                if (searchTerm) {
                    const filteredProducts = responseData.data.filter(product =>
                        product.countries.some(country => country.country_name.toLowerCase().includes(searchTerm.toLowerCase()))
                    );
                    setFilteredProducts(filteredProducts);
                } else {
                    setFilteredProducts([]); // Reset the filtered products when no search term is present
                }


                // Group regional products by region
                const groupedProducts = {};
                regionalProducts.forEach(product => {
                    const region = product.region;
                    if (!groupedProducts[region]) {
                        groupedProducts[region] = [];
                    }
                    groupedProducts[region].push(product);
                });
                setRegionsProducts(groupedProducts);


                // Group country products by country
                const groupedCountryProducts = {};
                countryProducts.forEach(product => {
                    product.countries.forEach(country => {
                        const countryName = country.country_name;
                        if (!groupedCountryProducts[countryName]) {
                            groupedCountryProducts[countryName] = [];
                        }
                        groupedCountryProducts[countryName].push(product);
                    });
                });
                //console.log('Grouped country products:', groupedCountryProducts);
                setCountriesProducts(groupedCountryProducts);


                // Group global products
                const groupedGlobalProducts = {
                    true: globalPlanProducts.filter(product => product.global_plan === true),
                    //false: globalPlanProducts.filter(product => product.global_plan === false),
                };
                //console.log('Grouped global products:', groupedGlobalProducts);
                setGlobalPlanProducts(groupedGlobalProducts);
                    
                }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {

        fetchProducts();
    }, []);


    const handleSearch = (searchTerm) => {
        setDisplayedProductsCount(ITEMS_PER_PAGE); // Reset displayed products count
        fetchProducts(searchTerm);
        console.log(`Searching for: ${searchTerm}`);
    };



    return (
        <CartProvider addToCart={addToCart} removeFromCart={removeFromCart}>
            <>
                <Header removeFromCart={removeFromCart} onSearch={handleSearch} />
                <Routes>
                    <Route
                        path='/'
                        element={
                        <HomeComponent
                            addToCart={handleAddToCart}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            countriesProducts={countriesProducts}
                            displayedProductsCount={displayedProductsCount}
                            openAccordion={openAccordion}
                            handleAccordionClick={handleAccordionClick}
                            setDisplayedProductsCount={setDisplayedProductsCount}
                            regionsProducts={regionsProducts}
                            globalPlanProducts={globalPlanProducts}
                            handleSearch={handleSearch}
                            cartItems={cartItems}
                            filteredProducts={filteredProducts}
                        />
                        }
                    />
                    <Route path='/products/:productId' element={<SingleProductPage />} />
                    <Route path="/checkout" element={<CheckoutPage cartItems={cartItems} onCompleteOrder={setCompleteOrderData} />} />
                    <Route path="/success" element={<SuccessPage completeOrderData={completeOrderData} />} />
                </Routes>
                <Footer />
                <ToastContainer />
            </>
        </CartProvider>
    );
}

export default App
