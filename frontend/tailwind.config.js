/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-thin": {
          scrollbarWidth: "thin",
          scrollbarColor: "rgb(105,105,105) white",
          scrollbarRadius:"20px"
        },
        ".scrollbar-webkit": {
          "&::-webkit-scrollbar": {
            width: "4px"
          },
          "&::-webkit-scrollbar-track": {
            background: "white"
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgb(105,105,105)",
            borderRadius: "20px",
            border: "1px solid white"
          }
        },

        ".scrollbar-thinner": {
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar-thumb": {
            borderRadius: "30px", // Adjust the border-radius to make it more rounded
          },
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    }
  ]

}

