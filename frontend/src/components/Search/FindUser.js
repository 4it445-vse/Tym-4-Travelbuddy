import React, { Component } from 'react';

import { User } from './User.js';
import axios from 'axios';

export class FindUser extends Component {
  constructor(props){
      super(props);

      this.state = {
          data: {}
        };
    }

  componentDidMount() {
    axios
      .get('http://dev.backend.team04.vse.handson.pro/api/buddies')
      .then(response => {
        this.setState({
          data: response,
        });
      });
  }

    render() {
      const {data} = this.state;
      console.log(data);
        return (
            <div className="row">
                <div className="card v-o-5">
                    <div className="card-block">
                        <h4 className="card-title">Pro město X bylo nalezeno X uživatelů</h4>
                    </div>
                    <User data={data}/>
                </div>
            </div>
        );
    }
}
