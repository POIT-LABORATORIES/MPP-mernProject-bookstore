import React from 'react';
import {Switch, Route, Redirect} from "react-router-dom";
import {BooksPage} from "./pages/BooksPage";
import {CreateBookPage} from "./pages/CreateBook";
import {DetailPage} from "./pages/DetailPage";
import {AuthPage} from "./pages/AuthPage";

export const useRoutes = isAuthent => {
    if (isAuthent) {
        return (
            <Switch>
                <Route path="/books" exact>
                    <BooksPage/>
                </Route>
                <Route path="/create" exact>
                    <CreateBookPage/>
                </Route>
                <Route path="/detail/:id">
                    <DetailPage/>
                </Route>
                <Redirect to="/create" />
            </Switch>
        );
    }

    return (
        <Switch>
            <Route path="/" exact>
                <AuthPage />
            </Route>
            <Route>
                <Redirect to="/" />
            </Route>
        </Switch>
    );
}