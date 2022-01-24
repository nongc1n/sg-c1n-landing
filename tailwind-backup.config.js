module.exports = {
  content: ["./dist/**/*.{html,js}"],
  corePlugins: {
    container: false,
  },
  theme: {
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
        "c1n-orange": "#FF0000",
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".container": {
          maxWidth: "1185px",
          margin: "0 auto",
          padding: "0 1.5rem",
          "@screen md": {
            maxWidth: "720px",
            padding: 0,
          },
          "@screen lg": {
            maxWidth: "960px",
            padding: 0,
          },
          "@screen xl": {
            maxWidth: "1185px",
            padding: 0,
          },
        },
      });
    },
  ],
};
