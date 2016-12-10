import React, {Component} from "react";
import currentUser from "../../actions/CurrentUser";
import AbstractModal from "./AbstractModal";
import FormGroup from "./FormGroup";
import axios from "../../api";
import GooglePlacesSuggest from "../Autosuggest/SuggestCity"

export default class ShowProfileModal extends Component {

    render() {
        const {showProp, hideFn, buddy} = this.props;
        const loggedUser = currentUser.getCurrentUser();
        const title = "Editace profilu - " + loggedUser.name + " " + loggedUser.surname;
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
                </Modal.Footer>
            </Modal>
        );
    }
}
