import React from "react";
import AutopeLogo from "../../resources/assets/Autope_Textless_Logo.png";
import CButton from "../common/CButton";

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <img src={AutopeLogo} alt="Autope Logo" className="navbar-logo" />
        <div className="navbar-text">
          <span className="navbar-title text-blue">Sync</span>
          <span className="navbar-subtitle">
            The Autope Product Management Tool
          </span>
        </div>
      </div>
      <CButton variant="text">Contact Us</CButton>
    </header>
  );
};

export default Navbar;
