import React from "react";
import ControlledCarousel from "../js/Corousel";
import Counter from "../js/registered_so_far";
import Footer from "../js/Footer";
export default function HomePage(){
    return(<>
    <ControlledCarousel/>
    <br></br>
    <Counter/>
    <Footer/>
    </>);
}