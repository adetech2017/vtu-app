import {useState, useEffect} from 'react';
import './Slider.css';
//import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';




const Slider = ({imageUrls, heading, subheading}) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % imageUrls.length);
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + imageUrls.length) % imageUrls.length);
    };
    
    useEffect(() => {
        // Auto-scroll every 5 seconds
        const interval = setInterval(() => {
            handleNextSlide();
        }, 5000);
    
        // Clean up the interval when the component is unmounted
        return () => clearInterval(interval);
    }, [currentSlide]);
    
    
    

    return (
        <div className="slider-container">
            <div className="slider-text">
                <h2>{heading}</h2>
                <p>{subheading}</p>
            </div>
            <img 
                className="slider-image" 
                src={imageUrls[currentSlide]} 
                alt={`Slide ${currentSlide + 1}`} 
            />  
        </div>
    );
};

export default Slider;
