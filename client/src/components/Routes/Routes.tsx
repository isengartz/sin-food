import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HomePage from '../../pages/home';
import SearchStores from '../../pages/search-stores';
import NotFoundPage from '../../pages/404';
import RegisterUserPage from '../../pages/register-user';
import UnAuthRoute from './UnAuthRoute/UnAuthRoute';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { selectCurrentUser } from '../../state';
import AuthRoute from './AuthRoute/AuthRoute';
import RestaurantPage from '../../pages/restaurant-page';
import CheckOutPage from '../../pages/checkout';

/**
 * Application Routes
 * @constructor
 */
const Routes: React.FC = () => {
  const user = useTypedSelector(selectCurrentUser);
  return (
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
      <AuthRoute redirectTo="/" isLogged={!!user} exact path="/search-stores">
        <SearchStores />
      </AuthRoute>
      <AuthRoute redirectTo="/" isLogged={!!user} exact path="/restaurant/:id">
        <RestaurantPage />
      </AuthRoute>
      <UnAuthRoute redirectTo="/" isLogged={!!user} exact path="/register">
        <RegisterUserPage />
      </UnAuthRoute>
      <AuthRoute redirectTo="/" isLogged={!!user} exact path="/checkout">
        <CheckOutPage />
      </AuthRoute>
      <Route path="*">
        <NotFoundPage />
      </Route>
    </Switch>
  );
};

export default Routes;
