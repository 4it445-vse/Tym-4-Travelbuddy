import React, {Component} from "react";
import {PageFooter} from "../components/PageFooter/PageFooter";
import TopNavigation from "../components/TopNavigation/TopNavigation";

export class AppPage extends Component {

    constructor(props) {
        super(props);
        this.getAlert = this.getAlert.bind(this);
    }

    getAlert() {
        const urlParams = this.props.location.query;
        if(urlParams.alert === "EMAIL_VERIFIED"){

        }else if(urlParams.alert === "EMAIL_VERIFICATION_SENT"){

        }
        console.log(urlParams);
    }

    render() {
        const {children} = this.props;
        return (
            <div>
                <TopNavigation/>
                { this.getAlert() }
                <div className="container">
                    {children}
                </div>
                <PageFooter/>
            </div>
        );
    }
}
