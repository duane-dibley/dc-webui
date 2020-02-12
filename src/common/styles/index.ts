import red from '@material-ui/core/colors/red';
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#3f51b5',
      // main: '#424242',
    },
    secondary: {
      main: '#19857b',
      // main: '#808080',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fafafa',
      // default: '#303030',
    },
  },
};

const theme: Theme = createMuiTheme(themeOptions);

export default theme;
