import React from "react";
import "./Testimonials.css";

const Testimonials = () => {
  const cards = Array.from({ length: 12 }, (i) => i + 1);

  return (
    <>
    <div id="testimonials">
    <h1>Testimonials</h1>
    </div>
    <div className="card-container">
      {cards.map((card, index) => (
        <div key={index} className={`card row-${Math.floor(index / 4)}`}>
          <img className="logo-chat" src="logochat.png"/>
          
          <p><p>Krishnanu Nag</p><br/>Their mentorhsip helped me a lot i got into my dream College IIT Bombay</p>
        </div>
      ))}
    </div>
    </>
  );
};

export default Testimonials;
