import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router';

interface UnAuthRouteProps extends RouteProps {
  redirectTo: string;
  isLogged: boolean;
}

/**
 * Route that can only be accessed from **NON LOGGED IN USER**
 * Examples : Register Page
 * @param redirectTo
 * @param isLogged
 * @param children
 * @param rest
 * @constructor
 */
const UnAuthRoute: React.FC<UnAuthRouteProps> = ({
  redirectTo = '/',
  isLogged = false,
  children,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !isLogged ? (
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

export default UnAuthRoute;
