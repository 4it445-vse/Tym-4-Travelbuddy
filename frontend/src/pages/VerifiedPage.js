import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from "react-redux";
import { openAlert } from "../actions/modals";

class VerifiedPage extends Component {

    constructor(props){
        super(props);
        this.props.openAlert({"type":"success", "message":"Thank you! You can login now."});
        browserHistory.push("/");

    }

  render() {
    return ("");
  }
}

export default connect(
    null,
    {
        openAlert
    }
)(VerifiedPage);
