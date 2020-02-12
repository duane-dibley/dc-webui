import React from 'react';
import { Route, Switch } from 'react-router-dom';
import EditorRoute from './EditorRoute';
import LoginRoute from './LoginRoute';

export default function routes(): JSX.Element {
  return (
    <>
      <Switch>
        <Route exact path="/editor">
          <EditorRoute />
        </Route>
      </Switch>

      <Switch>
        <Route exact path="/login">
          <LoginRoute />
        </Route>
      </Switch>
    </>
  );
}

export { EditorRoute, LoginRoute };
