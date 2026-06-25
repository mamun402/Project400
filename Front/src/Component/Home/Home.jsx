import React from "react";
import About from "../About/About";
import Committee from "../Committee/Committee";
import Event from "../Event/Event";
import Gallery from "../Galery/Galery";
import Hero from "../Hero/Hero";
import Notice from "../Notice/Notice";
import TestimonialSlider from "../Testimonial/Testimonial";

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Notice />
      <Gallery />
      <Event />
      <Committee />
      <TestimonialSlider />
    </>
  );
};

export default Home;
