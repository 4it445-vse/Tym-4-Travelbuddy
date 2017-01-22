import React, {Component} from "react";
import {Provider} from "react-redux";
import {Router, applyRouterMiddleware, browserHistory} from "react-router";
import {useScroll} from "react-router-scroll";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import 'react-select/dist/react-select.css';
import "./App.css";
import {createRoutes} from "./createRoutes.js";
import currentUser from "./actions/CurrentUser";

export class App extends Component {

    componentDidMount() {
        currentUser.loadAuthToken();
    }

    render() {
        const {store} = this.props;
        const routes = createRoutes(store);

        return (
            <Provider store={store}>
                <Router history={browserHistory} render={applyRouterMiddleware(useScroll())}>
                    {routes}
                </Router>
            </Provider>
        );
    }
}
