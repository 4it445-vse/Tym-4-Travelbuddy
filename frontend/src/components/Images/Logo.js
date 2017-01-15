import React, {Component} from "react";
import logo from '../../../public/log.png' // relative path to image

class Logo extends Component {
    render() {
        const {children} = this.props;
        return (
            <img src={logo} alt={"logo"}/>
        );
    }
}
