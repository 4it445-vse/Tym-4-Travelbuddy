import React, {Component} from "react";
import GeneralRequests from "./GeneralRequests";

export default class RequestsPage extends Component {

    render() {
        return (
            <GeneralRequests mine={false}/>
        );
    }
}