/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
      "2xl": "1680px",
      phone: { min: "320px", max: "480px" },
      laptop: { min: "1024px", max: "1440px" },
      pc: { min: "1441px" },
    },
    boxShadow: {
      DEFAULT: "0px 4px 10px rgba(191, 202, 213, 0.25)",
    },
    fontSize: {
      sm: "10px",
      base: "12px",
      lg: "14px",
      xl: "16px",
      "2xl": "18px",
      "3xl": "28px",
      "4xl": "38px",
      "5xl": "48px",
      "6xl": "60px",
    },
    extend: {
      colors: {
        primary: {
          100: "#E6F6F6",
          200: "#CCEEED",
          300: "#99DDDB",
          400: "#66CBCA",
          500: "#33BABB",
          600: "#00A9A6",
          700: "#008F8D",
          800: "#006B6A",
          900: "#004846",
          1000: "#002423",
        },
        second: "#717D8A",
        third: {
          500: "#EC892D",
          100: "#EC892D26",
        },
        lafWhite: {
          100: "#FEFEFE",
          200: "#FDFDFE",
          300: "#FBFBFC",
          400: "#F8FAFB",
          500: "#F6F8F9",
          600: "#F4F6F8",
          700: "#C3C5C6",
          800: "#929495",
          900: "#626263",
          1000: "#313132",
        },
        lafDark: {
          100: "#1a202c",
          200: "#202631",
          300: "#303541",
          400: "#404551",
          500: "#505561",
          600: "#606571",
          700: "#707581",
          800: "#808591",
          900: "#9095A1",
          1000: "#A0A5B1",
        },
        grayModern: {
          100: "#EFF0F1",
          200: "#DEE0E2",
          300: "#BDC1C5",
          400: "#9CA2A8",
          500: "#7B838B",
          600: "#5A646E",
          700: "#485058",
          800: "#363C42",
          900: "#24282C",
          1000: "#121416",
        },
        grayIron: {
          100: "#F3F3F3",
          200: "#E6E6E7",
          300: "#CDCDD0",
          400: "#B4B4B8",
          500: "#9B9BA1",
          600: "#828289",
          700: "#68686E",
          800: "#4E4E52",
          900: "#343437",
          1000: "#1A1A1B",
        },
        error: {
          100: "#FDECEE",
          200: "#FFD6DB",
          400: "#FF8492",
          500: "#F16979",
          600: "#ED4458",
        },
        warn: {
          100: "#FFF2EC",
          400: "#FDB08A",
          600: "#FB7C3C",
          700: "#C96330",
        },
        rose: {
          100: "#FDEAF1",
          500: "#ED598E",
        },
        purple: {
          300: "#DBBDE9",
          400: "#C99CDF",
          600: "#A55AC9",
          700: "#7167AA",
        },
        adora: {
          100: "#F2F1FB",
          200: "#E6E3F7",
          600: "#8172D8",
        },
        blue: {
          100: "#EBF7FD",
          400: "#86CEF5",
          500: "#5EBDF2",
          600: "#36ADEF",
          700: "#2B8ABF",
        },
        frostyNightfall: {
          200: "#EAEBF0",
          300: "#D5D6E1",
        },
      },
    },
  },
  plugins: [],
};
