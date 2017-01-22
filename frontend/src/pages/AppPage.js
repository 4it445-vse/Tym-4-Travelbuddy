import React, {Component} from "react";
import TopNavigation from "../components/TopNavigation/TopNavigation";

export class AppPage extends Component {

    render() {
        console.log(this.props.location.query.hi);
        const {children} = this.props;
        return (
            <div>
                <TopNavigation/>
                <div className="container-fluid">
                    {children}
                </div>
            </div>
        );
    }
}
