import React, { Component } from 'react';
import moment from 'moment';
import axios from "../../api";
import api from "../../api"

export class RequestListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      req_id: props.requestId,
      buddy: {},
      request:{},
      render: false
    };

    this.fetchBuddy = this.fetchBuddy.bind(this);
    this.showRequestDetails = this.showRequestDetails.bind(this);
    this.openContactBuddy = this.openContactBuddy.bind(this);
  }

  openContactBuddy(){
    this.props.openContactBuddy(this.state.buddy);
  }

  showRequestDetails(){
    this.props.openShowRequestShowModal(this.state.buddy, this.state.request);
  }

  componentDidMount() {
    this.fetchBuddy();
  }

  fetchBuddy(){
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
    const { openContactBuddy } = this.props;
    const { city, from, to } = this.state.request;
    const { name, email } = this.state.buddy
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
              Email:
            </div>
            <div className="col-xs-9 text-xs-left ellipsis">
              {this.state.buddy.email}
            </div>
          </div>
          <hr/>
          <div className="row">
            <div className="col-xs-5 text-xs-right">
              Datum od:
            </div>
            <div className="col-xs-7">
              {moment(from).format('DD.MM.YYYY')}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-5 text-xs-right">
              Datum do:
            </div>
            <div className="col-xs-7">
              {moment(to).format('DD.MM.YYYY')}
            </div>
          </div>
          <hr/>
          <div className="row">
            <div className="col-xs-6">
              <button className="btn btn-defaul SearchButton text-white" type="button" onClick={this.showRequestDetails}>Detail</button>
            </div>
            <div className="col-xs-6">
              <button className="btn btn-defaul SearchButton text-white" type="button" onClick={this.openContactBuddy}>Kontaktovat</button>
            </div>
          </div>
        </div> ) :
        (
                  <div className="request lazyloadReq"><img src={loader}/></div>
        )
      }
      </div>
    );
  }
}
