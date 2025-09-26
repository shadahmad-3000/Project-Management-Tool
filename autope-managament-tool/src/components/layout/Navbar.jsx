import React from "react";
import AutopeLogo from "../../resources/assets/Autope_Logo.jpeg";
import CButton from "../common/CButton";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-4 z-50 bg-white/70 backdrop-blur-md shadow-sm">
      <div className="flex items-center space-x-3">
        <img src={AutopeLogo} alt="Autope Logo" className="h-10 w-auto" />
        <div className="flex flex-col">
          <span className="text-lg font-semibold leading-tight">
            <span className="text-blue-600">Sync</span>
          </span>
          <span className="text-sm text-gray-900">
            The Autope Product Management Tool
          </span>
        </div>
      </div>
      <CButton
        variant="secondary"
        className="text-blue"
        style={{
          backgroundColor: "transparent",
          border: "2px solid var(--blue)",
          color: "var(--blue)",
        }}
      >
        Contact Us
      </CButton>
    </header>
  );
};

export default Navbar;
