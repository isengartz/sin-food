import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HomePage from '../../pages/home';
import SearchStores from '../../pages/search-stores';
import NotFoundPage from '../../pages/404';
import RegisterUserPage from '../../pages/register-user';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route exact path="/search-stores">
        <SearchStores />
      </Route>
      <Route exact path="/register">
        <RegisterUserPage />
      </Route>
      <Route path="*">
        <NotFoundPage />
      </Route>
    </Switch>
  );
};

export default Routes;
