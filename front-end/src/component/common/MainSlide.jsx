import React, { useState } from 'react';
import { Carousel, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../product/slide.css';

import img1 from "../../resources/images/main/main_slide3.png";
import img2 from "../../resources/images/main/main_slide4.png";

import styles from "./main.module.css"

const MainSlide = () => {
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setSelectedCardIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={selectedCardIndex} onSelect={handleSelect} interval={null} className={styles.carousel_wrapper}>
      <Carousel.Item>
        <Card className={styles.slide_card}>
        <img className={styles.mainImg}
                src={img1}
                alt="slide1"
                />   
        </Card>
      </Carousel.Item>
      <Carousel.Item>
        <Card className={styles.slide_card}>
        <img className={styles.mainImg}
                src={img2}
                alt="slide1"
                />   
        </Card>
      </Carousel.Item>
    </Carousel>
  );
};

export default MainSlide;