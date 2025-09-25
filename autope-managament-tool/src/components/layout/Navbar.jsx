import React from "react";
import { Button } from "antd";
import AutopeLogo from "../../assets/Autope_Logo.jpeg";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-4 z-50 bg-white/70 backdrop-blur-md shadow-sm">
      <div className="flex items-center space-x-3">
        <img src={AutopeLogo} alt="Autope Logo" className="h-10 w-auto" />
        <div className="flex flex-col">
          <span className="text-lg font-semibold leading-tight">
            <span className="text-gray-700">auto</span>{" "}
            <span className="text-blue-600">p</span>
            <span className="text-black">roj</span>
            <span className="text-blue-600">e</span>
            <span className="text-black">ct</span>
          </span>
          <span className="text-sm text-gray-900">
            The Autope Product Management Tool
          </span>
        </div>
      </div>
      <Button color="green" variant="outlined">
        Contact Us
      </Button>
    </header>
  );
};

export default Navbar;
