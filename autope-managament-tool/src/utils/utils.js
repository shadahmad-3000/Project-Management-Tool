import regularExpressions from "./regularExpressions";

export const validateCustomRegExp = (regEx, text) => {
  return regEx.test(text);
};
export const validateRegExp = (regExpName, text) => {
  const regExp = regularExpressions[regExpName];
  return regExp.test(text);
};
