import React, {Component} from "react";
import {RequestListItem} from "./RequestListItem.js";
import LazyLoad from 'react-lazyload';

export class RequestsList extends Component {

    renderRequests(){
    const {requests, openShowRequestShowModal, openContactBuddy} = this.props;
    const loader = require('../../images/lazyload.gif');
    const placeholder = (<div className="col-lg-4 col-md-6 col-xs-12"><div className="request lazyloadReq"><img src={loader}/></div></div>)
    var render = []
    for(var i = 0; i < requests.length; i++) {
      render.push(<LazyLoad placeholder={placeholder} key={requests[i].id} height="50px" ><RequestListItem requestId={requests[i].id}
                       openShowRequestShowModal={openShowRequestShowModal} openContactBuddy={openContactBuddy}/></LazyLoad>)
    }
    return render
    }

    render() {
        return (
        <div className="row">
            <div className="requests v-o-5">
                {this.renderRequests()}
            </div>
        </div>
    )
        ;
    }
}
