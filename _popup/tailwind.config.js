/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "lp-yellow": "rgb(255 192 30)",
        "lp-yellow-dark": "#ffc01e40",
        "lp-green": "rgb(0 184 163)",
        "lp-green-dark": "#2cbb5d40",
        "lp-green-bg": "rgb(44 187 93)",
        "lp-red": "rgb(255 55 95)",
        "lp-red-dark": "#ef474340",
        "lp-white": "#e7e7e7",
        "lp-grey": "#eff1f6bf",
        "lp-greyer": "#ebebf54d",
        "lp-dark": "#ffffff1a"
      }
    },
  },
  plugins: [],
}
