import React, {Component} from 'react';

import {User} from './User.js';

export class FindUser extends Component {
    render() {
        const {budies} = this.props;
        return (
            <div className="row">
                <div className="card v-o-5">
                    <div className="card-block">
                        <h4 className="card-title">Bylo nalezeno {budies.length} {budies.length === 1 ? "uživatel" : "uživatelů"}</h4>
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
