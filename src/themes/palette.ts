import { gray, red, green, blue, yellow, skyblue, purple, indigo, white } from './colors';

const palette = {
   neutral: {
      light: gray[100],
      main: gray[500],
      dark: gray[900],
   },
   primary: {
      light: skyblue[300],
      main: skyblue[500],
   },
   secondary: {
      light: skyblue[300],
      main: skyblue[500],
      dark: indigo[300],
   },
   info: {
      lighter: white[100],
      light: white[200],
      main: white[300],
      dark: white[400],
      darker: white[500],
   },
   success: {
      main: green[500],
      dark: green[900],
   },
   warning: {
      light: yellow[300],
      main: yellow[500],
   },
   error: {
      light: red[100],
      main: red[500],
      dark: red[900],
   },
   text: {
      primary: indigo[500],
      secondary: gray[900],
      disabled: gray[500],
   },
   gradients: {
      primary: {
         main: purple[500],
         state: indigo[300],
      },
      secondary: {
         main: blue[500],
         state: skyblue[500],
      },
   },
};

export default palette;
