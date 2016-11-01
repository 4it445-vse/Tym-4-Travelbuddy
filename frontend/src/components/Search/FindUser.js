import React, { Component } from 'react';

import { User } from '/home/team04/code/project/frontend/src/components/Search/User.js';

export class FindUser extends Component {
    render() {
        return (
            <div className="row">
                <div className="card v-o-5">
                    <div className="card-block">
                        <h4 className="card-title">Pro město X bylo nalezeno X uživatelů</h4>
                    </div>
                    <User/>
                </div>
            </div>
        );
    }
}