import React, { Component } from 'react';
import currentUser from "../actions/CurrentUser";
import { browserHistory } from 'react-router'

export class VerifiedPage extends Component {

    constructor(props){
        super(props);
        currentUser.setAlert({"type":"success", "message":"Thank you! You can login now."});
        browserHistory.push("/");
    }

  render() {
    return (
      <div>
      </div>
    );
  }
}
