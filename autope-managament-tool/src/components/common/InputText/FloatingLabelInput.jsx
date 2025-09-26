// FloatingLabelInput.jsx
import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  useContext,
} from "react";
import "./FloatingLabelInput.css";
import { validateCustomRegExp, validateRegExp } from "../../../utils/utils";

const FloatingLabelInput = React.forwardRef((props, ref) => {
  const {
    inputValue = "",
    label,
    placeholder = "",
    inputStyle,
    containerStyle,
    inputContainerStyle,
    secureTextEntry,
    showError = false,
    errorMessage,
    isValidInput,
    regExp,
    customRegExp,
    showRightButton,
    customRightView,
    buttonText,
    editable = true,
    disabled = false,
    keyboardType,
    onChangeInputText,
    onButtonPress,
    onSubmitEditing,
    onFocus,
    onChange,
    onBlur,
    autoFocus,
    clickable = true,
    placeHolderTextStyle,
    onClick,
    onClickInput,
    showLeftButton = false,
    customLeftView,
    leftViewText,
    topLabel,
    textShowPosition = false,
    ...restOfProps
  } = props;

  const inputRef = useRef(null);
  const [value, setValue] = useState(inputValue || "");
  const [isFocused, setIsFocused] = useState(false);
  const { translate } = useContext(AppContext);

  useEffect(() => {
    setValue(inputValue ?? "");
  }, [inputValue]);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (textShowPosition && inputRef.current) {
      try {
        inputRef.current.setSelectionRange?.(0, 0);
      } catch (err) {
        // ignore if not supported
      }
    }
  }, [textShowPosition]);

  const isLabelActive = isFocused || value !== "";

  const onChangeHandler = (e) => {
    const text = e?.target?.value ?? "";

    const obj = {
      text: text,
      isValid: !!regExp && regExp.length > 0 ? false : true,
      type: regExp,
    };

    if (!!regExp && regExp.length > 0) {
      const textForValidation =
        regExp === "email" || regExp === "upi"
          ? text?.replace(/\s/g, "")
          : text;
      obj.isValid = validateRegExp(regExp, textForValidation);
      obj.text = regExp === "upi" ? text?.replace(/\s/g, "") : text;
    }

    if (customRegExp) {
      try {
        const regEx = new RegExp(customRegExp);
        obj.isValid = validateCustomRegExp(regEx, text);
      } catch (err) {
        console.error("Invalid customRegExp provided:", customRegExp, err);
        obj.isValid = false;
      }
    }

    setValue(text);

    if (onChange) {
      try {
        onChange({ target: { value: text } });
      } catch (err) {
        // fallback: ignore
      }
    }

    if (onChangeInputText) {
      if (!!regExp && regExp.length > 0) {
        onChangeInputText(obj);
      } else {
        onChangeInputText(text);
      }
      if (customRegExp) {
        onChangeInputText(obj);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSubmitEditing && onSubmitEditing(e);
    }
  };

  const onFocusHandler = (event) => {
    setIsFocused(true);
    if (textShowPosition && inputRef.current) {
      try {
        inputRef.current.setSelectionRange?.(0, 0);
      } catch (err) {}
    }
    onFocus && onFocus(event);
  };

  const onBlurHandler = (event) => {
    setIsFocused(false);
    onBlur && onBlur(event);
  };

  const setFocus = () => {
    if (editable) {
      inputRef.current?.focus();
    }
  };

  const renderRightView = () => {
    if (customRightView) {
      return <div className="fli-right-button">{customRightView()}</div>;
    }
    return (
      <button
        type="button"
        className="fli-right-button"
        onClick={(ev) => {
          ev.stopPropagation();
          onButtonPress && onButtonPress();
        }}
      >
        <span className="fli-button-text">{buttonText ?? "CHANGE?"}</span>
      </button>
    );
  };

  const renderLeftView = () => {
    if (customLeftView) {
      return customLeftView();
    }
    return <span className="fli-left-text">{leftViewText}</span>;
  };

  const renderTopLabel = () => {
    return topLabel ? <p className="fli-top-label">{topLabel}</p> : null;
  };

  const inputType = secureTextEntry
    ? "password"
    : keyboardType === "number-pad"
    ? "tel"
    : keyboardType || "text";

  const containerOnClick = () => {
    if (clickable && !editable && showRightButton) {
      onButtonPress && onButtonPress();
    } else {
      setFocus();
    }
  };

  const wrapperClass = `fli-wrapper ${!editable ? "fli-readonly" : ""}`;
  const containerClass = [
    "fli-container",
    showError ? "fli-error" : "",
    isLabelActive ? "fli-active" : "",
    isValidInput ? "fli-valid" : "",
    disabled ? "fli-disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      onClick={onClickInput || containerOnClick}
      className={wrapperClass}
      style={containerStyle}
    >
      {renderTopLabel()}

      <div className={containerClass} style={inputContainerStyle}>
        {label ? (
          <p
            className={`fli-label ${isLabelActive ? "fli-label--active" : ""}`}
            style={placeHolderTextStyle}
          >
            {label}
          </p>
        ) : null}

        {showLeftButton && (
          <div className="fli-left-wrapper">{renderLeftView()}</div>
        )}

        <input
          ref={inputRef}
          className="fli-input"
          value={value}
          onKeyDown={handleKeyDown}
          type={inputType}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          disabled={disabled}
          readOnly={!editable}
          onChange={onChangeHandler}
          placeholder={isLabelActive ? placeholder : ""}
          style={inputStyle}
          {...restOfProps}
        />

        {showRightButton && renderRightView()}
      </div>

      {showError && <p className="fli-error-text">{errorMessage}</p>}
    </div>
  );
});

export default FloatingLabelInput;
