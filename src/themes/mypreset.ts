// mypreset.ts
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
import palette from './palette';

const Noir = definePreset(Aura, {
   semantic: {
      primary: {
         50: palette.primary.light,  // Adapt the primary light color to primary 50
         100: palette.primary.main,  // Primary main color for 100
         200: palette.primary.main,  // You can adjust this based on your palette
         300: palette.primary.main,  // Adjust as needed
         400: palette.primary.main,  // Adjust as needed
         500: palette.primary.main,  // Primary main color for 500
         600: palette.primary.main,  // Adjust as needed
         700: palette.primary.main,  // Adjust as needed
         800: palette.primary.main,  // Adjust as needed
         900: palette.primary.main,  // Primary dark color for 900
         950: palette.primary.main,  // Adjust as needed
      },
      colorScheme: {
         light: {
            primary: {
               color: palette.primary.main,  // Set color for primary in light mode
               inverseColor: '#ffffff',  // White for contrast
               hoverColor: palette.primary.light,  // Primary dark color for hover
               activeColor: palette.primary.main,  // Primary dark color for active
            },
            highlight: {
               background: palette.primary.main,  // Use primary color for background
               focusBackground: palette.primary.light,  // Use primary light color for focus background
               color: '#ffffff',  // White text color
               focusColor: '#ffffff',  // White focus color
               headingColor: palette.secondary.main,  // Set custom heading color for light mode
               textColor: '#415b61',  // Set custom text color for light mode
            },
         },
         dark: {
            primary: {
               color: palette.primary.light,  // Light color for primary in dark mode
               inverseColor: palette.primary.main,  // Inverse of primary main color
               hoverColor: palette.primary.light,  // Lighter color for hover
               activeColor: palette.primary.light,  // Lighter color for active
            },
            highlight: {
               background: 'rgba(250, 250, 250, .16)',  // A subtle highlight background for dark mode
               focusBackground: 'rgba(250, 250, 250, .24)',  // A bit darker for focus background
               color: 'rgba(255,255,255,.87)',  // Light color for text in dark mode
               focusColor: 'rgba(255,255,255,.87)',  // Focus text color
               headingColor: 'rgba(255, 255, 255, 0.9)',  // Set custom heading color for dark mode
               textColor: 'rgba(255, 255, 255, 0.87)',  // Set custom text color for dark mode
            },
         },
      },
      focusRing: {
         width: '2px',
         style: 'dashed',
         color: '{primary.color}',
         offset: '1px'
      }
   },
});

export default Noir;
