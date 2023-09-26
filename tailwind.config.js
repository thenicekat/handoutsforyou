/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./pages/**/*.{html,js,tsx}", "./Components/**/*.{html,js,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
};
