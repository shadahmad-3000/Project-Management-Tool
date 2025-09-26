import React from "react";
import Button from "react-bootstrap/Button";

const CButton = ({
  children,
  type = "button",
  variant = "primary",
  onClick,
  disabled = false,
  loading = false,
  className = "",
  ...rest
}) => {
  const baseClass = `btn btn-${variant} primary-button ${className}`;

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClass}
      style={{
        backgroundColor: variant === "primary" ? "var(--blue)" : undefined,
        color: "var(--white)",
        border: "none",
        borderRadius: "6px",
        padding: "8px 16px",
        fontFamily: "Poppins-Medium",
      }}
      {...rest}
    >
      {loading ? "Loading..." : children}
    </Button>
  );
};

export default CButton;
