export default {
  content: ['./index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/flowbite-react/**/*.{js,jsx}',
    './node_modules/flowbite/**/*.js',
    'node_modules/flowbite-react/**/*.{js,jsx}',
    'node_modules/flowbite/**/*.js'],
    
  theme: {
    extend: {
      colors: {
        darker: "#0d1728",
        dark: '#11242e',
        primary: '#00B7FF',
        secondary: '#008FED',
        like: '#FF6666',
        success: "#7AA874",
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

