import React, { Component } from 'react';

import { User } from './User.js';
import axios from 'axios';

export class FindUser extends Component {
  constructor(props){
      super(props);

      this.state = {
          budies: []
        };
    }

  componentDidMount() {
    axios.get('http://localhost:3001/api/buddies')
      .then(response => {
        this.setState({
          budies: response.data,
        });
      });
  }

    render() {
      const {budies} = this.state;
        return (
            <div className="row">
                <div className="card v-o-5">
                    <div className="card-block">
                        <h4 className="card-title">Pro město X bylo nalezeno X uživatelů</h4>
                    </div>
                    {
                        budies.map(buddy =>
                                <User buddy={buddy} key={buddy.id}/>
                        )
                    }

                </div>
            </div>
        );
    }
}
