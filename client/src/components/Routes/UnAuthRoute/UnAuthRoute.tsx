import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router';

interface UnAuthRouteProps extends RouteProps {
  redirectTo: string;
  isLogged: boolean;
}

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
