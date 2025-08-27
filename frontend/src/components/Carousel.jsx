import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import './Carousel.css'

export default function SimpleSlider() {
    const [receipts, setReceipts] = useState([]);
    
      useEffect(() => {
        fetch('/api/receipts-archive')
          .then(res => {
            if (!res.ok) {
              throw new Error("Failed to fetch receipts");
            }
            return res.json();
          })
          .then(data => {
            if (!data.receipt_data_objects) {
              alert("No receipts found!");
            } else {
              setReceipts(data.receipt_data_objects);
            }
          })
          .catch(err => {
            console.error("Error fetching receipts:", err);
            alert("Error loading receipts");
          });
      }, []);

    // const receipts = ['ertwer.jpg', 'sa4bzhkgewj81.jpg']

    var settings = {
        dots: true,
        // adaptiveHeight: true,
        infinite: true,
        speed: 100,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    return (
        <>
        <h1>Your Receipts</h1>
        <div className="slider-container">
            <Slider {...settings}>
            {receipts.map((receipt, index) => (
                <div key={index}>
                    <img src={receipt} alt={`Receipt ${index + 1}`} />
                </div>
            ))}
            </Slider>
        </div>
        </>
    );
}