import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import currentUser from "../../actions/CurrentUser";

export default class ShowProfileModal extends Component {

    constructor(props) {
        super(props);

        this.openContactBuddy = this.openContactBuddy.bind(this);
    }

    openContactBuddy() {
        this.setState({
            showRequestShowModal: false
        });
        this.props.hideFn();
        currentUser.openContactBuddy(this.props.buddy);
    }

    render() {
        const {showProp, hideFn, buddy, showContactButton} = this.props;
        return (
            <Modal show={showProp} onHide={hideFn}>
                <Modal.Header closeButton>
                    <Modal.Title>{buddy.name + " " + buddy.surname}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label htmlFor="exampleInputFile">Profilový obrázek:</label><br/>
                        <img
                            src="http://images.megaupload.cz/mystery-man.png"
                            alt="..." className="profil_img rounded"/>
                        <br/><br/>
                        <b>Pohlaví: </b>
                        {buddy.sex === 'male' ? "muž" : "žena"}
                        <br/>
                        <b>Město: </b>{buddy.city}
                        <br/>
                        <b>Hostuji: </b>
                        {buddy.is_hosting ? "ano" : "ne"}
                        <br/>
                        <b>Email: </b>{buddy.email}
                        <br/>
                        <label htmlFor="exampleInputFile"><b>O mně:</b></label>
                        <textarea type="text" className="form-control"
                                  id="about_me"
                                  defaultValue={buddy.about_me} disabled/>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {
                        showContactButton ?
                            <div className="form-check">
                                <button onClick={this.openContactBuddy} type="button"
                                        className="btn btn-primary fullsize">Kontaktovat
                                </button>
                            </div>
                            : ""
                    }
                </Modal.Footer>
            </Modal>
        );
    }
}
