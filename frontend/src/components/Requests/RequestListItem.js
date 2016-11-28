import React, { Component } from 'react';
import moment from 'moment';
import axios from "../../api";

export class RequestListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buddy_id: props.request.buddy_id,
      name: null,
      email: null
    };

    this.fetchBuddy = this.fetchBuddy.bind(this);
  }

  componentDidMount() {
    this.fetchBuddy(this.state.buddy_id);
  }

  fetchBuddy(buddy_id) {
    axios.get('buddies/' + buddy_id)
      .then((response) => {
        this.setState({ name: response.data.name });
        this.setState({ email: response.data.email });
      });
  }

  render() {
    const { request } = this.props;
    const { city, from, to } = request;
    return (
      <div className="col-lg-4 col-md-6 col-xs-12">
        <div className="request">
          <h2>{city}</h2>
          <hr/>
          <div className="row">
            <div className="col-xs-4 text-xs-right">
              Buddy:
            </div>
            <div className="col-xs-8 text-xs-left">
              {this.state.name}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-4 text-xs-right">
              Email:
            </div>
            <div className="col-xs-8 text-xs-left">
              {this.state.email}
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
              <button className="btn btn-defaul SearchButton text-white" type="button" /*onClick={Todo: Detail}*/>Detail</button>
            </div>
            <div className="col-xs-6">
              <button className="btn btn-defaul SearchButton text-white" type="button" /*onClick={Todo: Kontaktovat}*/>Kontaktovat</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
