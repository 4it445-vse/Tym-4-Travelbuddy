import React, {Component} from "react";
import GeneralRequests from "./GeneralRequests";

export default class MyRequestsPage extends Component {

    render() {
        return (
            <GeneralRequests mine={true}/>
        );
    }
}