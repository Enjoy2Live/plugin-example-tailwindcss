const { filterTokensByType } = require("./fns");

const tokens = require("./output/senf.json");

const extractTokenIndex = (tokens) =>
  Object.fromEntries(
    Object.entries(tokens).map(([key, value]) => {
      const keyArr = key.split('-');
      const removedKey = keyArr.shift();
      return [keyArr.join(), value]
    })
  );

const colors = filterTokensByType("color", tokens);
const typography = filterTokensByType("typography", tokens);
const fontFamily = extractTokenIndex(filterTokensByType("fontFamilies", tokens));
const fontWeight = extractTokenIndex(filterTokensByType("fontWeights", tokens));
const lineHeight = extractTokenIndex(filterTokensByType("lineHeights", tokens));
const fontSize = extractTokenIndex(filterTokensByType("fontSizes", tokens));
const letterSpacing = extractTokenIndex(filterTokensByType("letterSpacing", tokens));
const borderWidth = extractTokenIndex(filterTokensByType("borderWidth", tokens));
const opacity = extractTokenIndex(filterTokensByType("opacity", tokens));
const boxShadow = {
  ...filterTokensByType("boxShadow", tokens).shadows,
  ...filterTokensByType("boxShadow", tokens).borders,
};
const borderRadius = extractTokenIndex(filterTokensByType("borderRadius", tokens));
const textIndent = filterTokensByType("dimension", tokens); // how would we use this?

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors,
    fontFamily,
    fontWeight,
    lineHeight,
    fontSize,
    letterSpacing,
    borderWidth,
    opacity,
    boxShadow,
    borderRadius,
    textIndent,
    extend: {
      typography: ({ theme }) => console.log(theme.theme),
    },
  },
  variants: {},
  plugins: [],
};
