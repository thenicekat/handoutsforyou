/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./pages/**/*.{html,js,tsx}", "./Components/**/*.{html,js,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                mytheme: {
                    primary: "#ffffff",
                    secondary: "#d926a9",
                    accent: "#2dd4bf",
                    neutral: "#ffffff",
                    "base-100": "#000",
                    info: "#8F00FF",
                    success: "#22c55e",
                    warning: "#fbbd23",
                    error: "#f87272",
                },
            },
        ],
    },
};
