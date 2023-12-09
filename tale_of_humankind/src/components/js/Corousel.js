import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';

function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel fade activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
      <img className="d-block w-100" src={require('../static/carousel_1.png')} alt="Image_1" style={{height:"90vh"}}  />
        <Carousel.Caption>
          {/* <h3>Hiii</h3> */}
          <p style={{ color: "black", fontWeight: "bold" }}>Capturing memories and forging friendships that will last a lifetime!</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
      <img className="d-block w-100" src={require('../static/carousel_2.png')} alt="Image_1" style={{height:"90vh"}}  />
      
        <Carousel.Caption>
          {/* <h3>Second slide label</h3> */}
          <p style={{color:"black", fontWeight: "bold" }}>Witness the passion, creativity, and determination of our incredible participants as they present their transformative ideas to make a positive impact on society..</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
      <img className="d-block w-100" src={require('../static/carousel_3.png')} alt="Image_1" style={{height:"90vh"}}  />
      
       <Carousel.Caption>
          {/* <h3>Third slide label</h3> */}
          <p style={{color:"white" , fontWeight: "bold" }}>
            Exploring the realms of knowledge and embracing the power of learning!
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}
export default ControlledCarousel;