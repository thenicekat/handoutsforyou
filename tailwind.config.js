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
                    primary: "#FFFFFF",
                    secondary: "#d926a9",
                    accent: "#2dd4bf",
                    neutral: "#FFFFFF",
                    "base-100": "#000000",
                    info: "#d946ef",
                    success: "#84cc16",
                    warning: "#fde047",
                    error: "#ef4444",
                },
            },
        ],
    },
};
