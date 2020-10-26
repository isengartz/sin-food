import React from 'react';
import { Switch, Route, Link } from "react-router-dom";
import HomePage from "../../pages/home";
import SearchStores from "../../pages/search-stores";
import NotFoundPage from "../../pages/404";

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/">
                <HomePage />
            </Route>
            <Route exact path="/search-stores">
                <SearchStores />
            </Route>
            <Route path="*">
                <NotFoundPage />
            </Route>
        </Switch>
    );
};

export default Routes;
