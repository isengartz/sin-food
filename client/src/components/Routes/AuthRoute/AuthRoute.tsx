import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router';

interface AuthRouteProps extends RouteProps {
  redirectTo: string;
  isLogged: boolean;
}

const AuthRoute: React.FC<AuthRouteProps> = ({
  redirectTo = '/',
  isLogged = false,
  children,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLogged ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: redirectTo,
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default AuthRoute;
