import React, {Component} from "react";
import {RequestListItem} from "./RequestListItem.js";
import LazyLoad from "react-lazyload";
import Loading from "../Images/Loading";

export class RequestsList extends Component {

    renderRequests(){
    const {requests, openShowRequestShowModal, openContactBuddy} = this.props;
    const placeholder = (<div className="col-lg-4 col-md-6 col-xs-12"><div className="request lazyloadReq"><Loading/></div></div>)
    var render = []
    for(var i = 0; i < requests.length; i++) {
      render.push(<LazyLoad placeholder={placeholder} key={requests[i].id} height="50px" ><RequestListItem mine={this.props.mine} requestId={requests[i].id} request={requests[i]}
                       openShowRequestShowModal={openShowRequestShowModal} openContactBuddy={openContactBuddy}/></LazyLoad>)
    }

    return render
    }

    render() {
        var requestsCount = this.props.requests.length;
        var { city } = this.props;
        var numberOfResultsDiv = '';
        if(city) {
            numberOfResultsDiv = requestsCount > 0
                ?  <h3 className="foundBuddies col-xs-12">We have found {requestsCount} { requestsCount === 1 ? <span>request</span> : <span>requests</span> } for <span className="city">{city}</span></h3>
                : <h1 className="noRequestsFound">Sorry. No requests found for <span className="city">{city}</span></h1>
        }

        return (
            <div>
                <div className="row">
                    { numberOfResultsDiv }
                </div>
                <div className="row">
                    <div className="requests m-t-10">
                        {this.renderRequests()}
                    </div>
                </div>
            </div>
        );
    }
}
