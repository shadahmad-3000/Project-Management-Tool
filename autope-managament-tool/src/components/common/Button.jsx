import React from "react";

const CButton = ({
  children,
  type = "button",
  variant = "primary",
  onClick,
  disabled = false,
  loading = false,
  className = "",
  ...more
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-${variant} ${className}`}
      {...more}
    >
      {loading ? "Loading" : children}
    </button>
  );
};

export default CButton;
