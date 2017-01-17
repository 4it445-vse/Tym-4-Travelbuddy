import React, {Component} from "react";

export default class FindUser extends Component {

    constructor(props) {
        super(props);
        this.imagePath = require("../../images/lazyload.gif");
    }

    render() {
        return (<img src={this.imagePath} alt="loading"/>);
    }
}