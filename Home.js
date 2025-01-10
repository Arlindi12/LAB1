import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Home.css"; // File për stilizimin

const Home = () => {
  const [showMessage, setShowMessage] = useState(false);

  const handleExploreClick = () => {
    setShowMessage((prevShowMessage) => !prevShowMessage);
  };

  return (
    <div className="home-container">
      <Navbar />
      <section className="hero-section">
        <div className="hero-content">
          <h1>Mirë se vini në Botën e Shëndetit dhe Fitnesit!</h1>
          <p>
            Zbuloni udhëzime të personalizuara për ushtrime, plane ushqimore dhe
            këshilla motivuese për të arritur qëllimet tuaja shëndetësore.
            Ndërtoni trupin që ëndërroni dhe përmirësoni jetën tuaj.
          </p>
          <button className="explore-button" onClick={handleExploreClick}>
            {showMessage ? "Mbyll" : "Zbuloni Më Shumë"}
          </button>
          {showMessage && (
            <p className="additional-message">
              Me platformën tonë, ju mund të krijoni programe stërvitjeje të
              personalizuara, të monitoroni progresin tuaj dhe të lidheni me një
              komunitet mbështetës.
            </p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
