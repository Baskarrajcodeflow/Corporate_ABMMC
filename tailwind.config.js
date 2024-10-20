/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",

  ],
  theme: {
    extend: {
      colors:{
        primary :{
          light : '#595e79',
          headers : '#4a517e',
          logoBlue : '#4e96af',
          iconDashboardBlue : '#16629d'
        }
      }
    },
    
  },
  plugins: [    
    require('@tailwindcss/forms'),
    function({ addUtilities }) {
      addUtilities({
        '.bg-radial-gradient': {
          backgroundImage: 'linear-gradient(85.89deg, #86b0d1 7.82%, #ed7b26 117.28%)' //'radial-gradient(#b7afc7, white)'  linear-gradient(85.89deg, #b7afc7 7.82%, white 117.28%),
        },
        '.bg-btn-gradient': {
          backgroundImage: 'linear-gradient(85.89deg, #ed7b26 7.82%, #13a0e2 117.28%)' 
        },
        'bg-dashboard-icons':{
          backgroundColor : '#16629d'
        }
        
      });
    },
  ],
}

