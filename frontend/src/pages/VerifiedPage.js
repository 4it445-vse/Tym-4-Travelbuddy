import React, { Component } from 'react';
import currentUser from "../actions/CurrentUser";
import { browserHistory } from 'react-router'

export class VerifiedPage extends Component {

    constructor(props){
        super(props);
        currentUser.setAlert({"type":"success", "message":"Děkujeme! Již se můžete přihlásit."});
        browserHistory.push("/");
    }

  render() {
    return (
      <div>
      </div>
    );
  }
}