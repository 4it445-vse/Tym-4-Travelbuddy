import React, {Component} from 'react';
import {Modal} from 'react-bootstrap';

import {User} from './User.js';

export class FindUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showProfileModal: false,
            buddy: {}
        };

        this.openProfile = this.openProfile.bind(this);
        this.closeProfile = this.closeProfile.bind(this);
    }

    openProfile(buddy) {
        this.setState({
            showProfileModal: true,
            buddy: buddy
        });
    }

    closeProfile() {
        this.setState({showProfileModal: false});
    }

    render() {
        const {budies} = this.props;
        const {buddy} = this.state;
        return (

            <div>
                <Modal show={this.state.showProfileModal} onHide={this.closeProfile}>
                    <Modal.Header closeButton>
                        <Modal.Title>{buddy.name + " " + buddy.surname}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            Pohlaví:
                            {buddy.sex === 'male' ? "muž" : "žena"}
                            <br/>
                            {"Město: " + buddy.city}
                            <br/>
                            Hostuji:
                            {buddy.is_hosting ? "ano" : "ne"}
                            <br/>
                            {"Email: " + buddy.email}
                            <br/>
                            {"O mě: " + buddy.about_me}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
                <div className="row">
                    <div className="card v-o-5">
                        <div className="card-block">
                            <h4 className="card-title">Bylo
                                nalezeno {budies.length} {budies.length === 1 ? "uživatel" : "uživatelů"}</h4>
                        </div>
                        {
                            budies.map(buddy =>
                                <User buddy={buddy} key={buddy.id} openProfile={this.openProfile}/>
                            )
                        }

                    </div>
                </div>
            </div>
        );
    }
}
