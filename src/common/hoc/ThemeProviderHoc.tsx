import React from 'react';
import { StylesProvider, ThemeProvider } from '@material-ui/core/styles';
import theme from '@styles';

export default function hoc(WrappedComponent: JSX.Element): JSX.Element {
  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        {WrappedComponent}
      </ThemeProvider>
    </StylesProvider>
  );
}
