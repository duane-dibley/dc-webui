import React from 'react';
import { BrowserRouter } from 'react-router-dom';

export default function hoc(WrappedComponent: JSX.Element): JSX.Element {
  return (
    <BrowserRouter>
      {WrappedComponent}
    </BrowserRouter>
  );
}
