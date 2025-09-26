export default {
  email:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  mobile: /^\d{10}$/,
  indianMobileNumber: /^[6-9]\d{9}$/,
  pin: /^\d{4}$/,
  name: /^[a-zA-Z\s]*$/,
  fullName: /^[a-zA-Z\s]*$/,
  aadhar: /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/,
  pan: /([A-Z]){5}([0-9]){4}([A-Z]){1}$/,
  number: /\d+/g,
  accountNumber: /^\d{9,18}$/,
  upi: /^[\w.-]+@[\w.-]+$/,
  ignoreSpecial: /[^a-zA-Z0-9 ]/g,
  pinCode: /^\d{6}$/,
  address: /^[a-zA-Z0-9\s\-\#\.]+$/,
  internationalNumberRegex: /^\+(?:[0-9] ?){1,14}[0-9]$/,
  SpecialCharactyerRegex: /^[a-zA-Z0-9\s,.'/-]*$/,
};
