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
  style = {},
  ...rest
}) => {
  const baseClass = `btn primary-button ${className}`;

  let customStyle = {
    borderRadius: "6px",
    fontFamily: "Poppins-Medium",
    padding: "8px 16px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    ...style,
  };

  switch (variant) {
    case "primary":
      customStyle = {
        ...customStyle,
        backgroundColor: "var(--primary-buttonBgColor)",
        color: "var(--primary-buttonTextColor)",
        border: "none",
      };
      break;

    case "danger":
      customStyle = {
        ...customStyle,
        backgroundColor: "var(--danger-buttonBgColor)",
        color: "var(--danger-buttonTextColor)",
        border: "none",
      };
      break;

    case "text":
      customStyle = {
        ...customStyle,
        background: "transparent",
        border: "none",
        color: "var(--primary-buttonBgColor)",
      };
      break;

    default:
      break;
  }

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClass}
      style={customStyle}
      {...rest}
    >
      {loading ? "Loading..." : children}
    </Button>
  );
};

export default CButton;
