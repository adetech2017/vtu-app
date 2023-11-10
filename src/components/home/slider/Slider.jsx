import {useState, useEffect, useCallback} from 'react';
import './Slider.css';




const Slider = ({imageUrls, heading, subheading}) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Define handleNextSlide using useCallback
    const handleNextSlide = useCallback(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % imageUrls.length);
    }, [imageUrls.length]);

    useEffect(() => {
        // Auto-scroll every 5 seconds
        const interval = setInterval(() => {
            handleNextSlide();
        }, 5000);

        // Clean up the interval when the component is unmounted
        return () => clearInterval(interval);
    }, [currentSlide, handleNextSlide]);



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
