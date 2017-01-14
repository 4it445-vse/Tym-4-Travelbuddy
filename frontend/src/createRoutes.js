import React from "react";
import {IndexRoute, Route} from "react-router";
import {AppPage} from "./pages/AppPage.js";
import HomePage from "./pages/HomePage.js";
import MessagesPage from "./pages/MessagesPage.js";
import MeetUpsAndRatings from "./pages/MeetUpsAndRatings.js";
import RequestsPage from "./pages/RequestsPage.js";
import VerifiedPage from './pages/VerifiedPage.js';
import ResetPassword from './pages/ResetPassword.js';
import TermsAndCondtionsPage from './pages/TermsAndCondtitionsPage.js';

export function createRoutes(store) {

    const requireAuth = (nextState, replace) => {
        const { user } = store.getState();
        if ( !user ) {
            replace('/');
        }
    };

    return (
        <Route path="/" component={AppPage}>
            <IndexRoute component={HomePage}/>
            <Route path="/messages" component={MessagesPage} onEnter={requireAuth}/>
            <Route path="/meetups-and-ratings" component={MeetUpsAndRatings} onEnter={requireAuth}/>
            <Route path="/requests" component={RequestsPage} onEnter={requireAuth}/>
            <Route path="/verified" component={VerifiedPage}/>
            <Route path="/reset-password" component={ResetPassword}/>
            <Route path="/terms-and-conditions" component={TermsAndCondtionsPage}/>
        </Route>
    );
}
