import React from "react";
import {IndexRoute, Route} from "react-router";
import {AppPage} from "./pages/AppPage.js";
import {HomePage} from "./pages/HomePage.js";
import MessagesPage from "./pages/MessagesPage.js";
import {RequestsPage} from "./pages/RequestsPage.js";
import GooglePlaces from "./pages/GooglePlaces.js"
import { VerifiedPage } from './pages/VerifiedPage.js';
import { ResetPassword } from './pages/ResetPassword.js';

export function createRoutes() {
    return (
        <Route path="/" component={AppPage}>
            <IndexRoute component={HomePage}/>
            <Route path="/messages" component={MessagesPage}/>
            <Route path="/UploadExample" component={UploadExample}/>
            <Route path="/requests" component={RequestsPage}/>
            <Route path="/verified" component={VerifiedPage}/>
            <Route path="/reset-password" component={ResetPassword}/>
        </Route>
    );
}
