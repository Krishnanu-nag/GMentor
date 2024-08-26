import React from 'react';
import './Founders.css';

const Founders = () => {
  return (
   <>
    <div className="founders-container">
      <div className="founder-card">
        <img src="founder1.png" alt="Founder" className="founder-image" />
        <h3 className="founder-name">Krishnanu Nag</h3>
        <p className="founder-description">
          <strong>Founder & CEO <br/>IIT ISM Dhanbad</strong>
        </p>
      </div>
      <div className="founder-card">
        <img src="founder2.png" alt="Founder" className="founder-image" />
        <h3 className="founder-name">Ayush Barman</h3>
        <p className="founder-description">
          <strong>Founder & CEO <br/>IIT ISM Dhanbad</strong>
        </p>
      </div>
    </div>
   </>
  );
};

export default Founders;
