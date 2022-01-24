module.exports = {
  content: ["./dist/**/*.{html,js}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        md: "3rem",
        xl: 0,
      },
    },
    fontSize: {
      xs: "16px",
      sm: "18px",
      base: "20px",
      md: "32px",
      lg: "40px",
      xl: "70px",
    },
    extend: {
      colors: {
        "c1n-gray": "rgba(0, 0, 0, 0.7)",
        "c1n-dark-gray": "rgba(0, 0, 0, 0.79)",
        "c1n-orange": "#FF0000",
        "c1n-space-cadet": "#303459",
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".container": {
          "@screen xl": {
            maxWidth: "1185px",
          },
        },
      });
    },
  ],
};
