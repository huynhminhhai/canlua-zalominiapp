module.exports = {
  purge: {
    enabled: true,
    content: ["./src/**/*.{js,jsx,ts,tsx,vue}"],
  },
  theme: {
    extend: {
      colors: {
        'primary-color': "var(--primary-color)",
        'secondary-color': "var(--secondary-color)",
        'gray-color': "var(--gray-color)",
        'black-color': "var(--black-color)",
        'bg-color': "var(--bg-color)",
        'heading-color': "var(--heading-color)",
        'dark-color': "var(--dark-color)",
      }
    },
  },
};
