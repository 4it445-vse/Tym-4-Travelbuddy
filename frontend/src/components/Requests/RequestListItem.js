import React, { Component } from 'react';
import moment from 'moment';
import axios from "../../api";

export class RequestListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      req_id: props.requestId,
      buddy: {},
      request:{},
      render: false
    };
  }

  openContactBuddy = () => {
    this.props.openContactBuddy(this.state.buddy);
  }

  showRequestDetails = () => {
    this.props.openShowRequestShowModal(this.state.buddy, this.state.request);
  }

  componentDidMount() {
    this.fetchBuddy();
  }

  fetchBuddy = () => {
    axios.get('requests/' + this.state.req_id, {params: {filter :{ include: "buddy"}}})
      .then((response) => {
        this.setState({
          buddy: response.data.buddy,
          request: response.data,
          render: true
        });
      });
  }

  render() {
    const { city, from, to } = this.state.request;
    const loader = require('../../images/lazyload.gif');
    return (
      <div className="col-lg-4 col-md-6 col-xs-12">
        { this.state.render ? (
        <div className="request">
          <h2>{city}</h2>
          <hr/>
          <div className="row">
            <div className="col-xs-3 text-xs-right">
              Buddy:
            </div>
            <div className="col-xs-9 text-xs-left ellipsis">
              {this.state.buddy.name}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-3 text-xs-right">
              E-mail:
            </div>
            <div className="col-xs-9 text-xs-left ellipsis">
              {this.state.buddy.email}
            </div>
          </div>
          <hr/>
          <div className="row">
            <div className="col-xs-3 text-xs-right">
              From:
            </div>
            <div className="col-xs-9 text-xs-left ellipsis">
              {moment(from).format('MM/DD/YYYY')}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-3 text-xs-right">
              To:
            </div>
            <div className="col-xs-9 text-xs-left ellipsis">
              {moment(to).format('MM/DD/YYYY')}
            </div>
          </div>
          <hr/>
          <div className="row">
            <div className="col-xs-6">
              <button className="btn btn-defaul SearchButton text-white" type="button" onClick={this.showRequestDetails}>Detail</button>
            </div>
            <div className="col-xs-6">
              <button className="btn btn-defaul SearchButton text-white" type="button" onClick={this.openContactBuddy}>Message</button>
            </div>
          </div>
        </div> ) :
        (
                  <div className="request lazyloadReq"><img src={loader} alt="Loading data"/></div>
        )
      }
      </div>
    );
  }
}
