import React, {Component} from 'react';
import { Modal } from 'react-bootstrap';
import FormGroup from './FormGroup';
import FormCheck from './FormCheck';

export default class LoginModal extends Component {
    render(){
        const {showProp, hideFn, submitFn, switchFn} = this.props;
        const title = "Registrace";
        return(
            <Modal show={showProp} onHide={hideFn}>
                    <Modal.Header closeButton>
                        <Modal.Title>Přihlášení</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <FormGroup>
                                <input type="email" name="email" className="form-control" id="email-l"
                                       placeholder="Váš email"/>
                            </FormGroup>
                            <FormGroup>
                                <input type="password" name="password" className="form-control" id="pass-l"
                                       placeholder="Heslo"/>
                            </FormGroup>
                            <div className="modal-group">
                                {/*
                                 <div className="form-check">
                                 <label className="form-check-label float-left">
                                 <input type="checkbox" className="form-check-input" name="remember-me"/>
                                 Zapamatovat si mě
                                 </label>
                                 <a href="#" className="float-right" data-dismiss="modal" data-toggle="modal"
                                 data-target="#zapommodal">Zapomenuté heslo?</a>
                                 </div>*/
                                }
                            </div>
                            <FormGroup>
                                <button onClick={submitFn} type="button"
                                        className="btn btn-primary fullsize v-o-5">Přihlásit
                                </button>
                            </FormGroup>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <FormCheck>
						  <span className="float-left">
							  Nemáš ještě účet?
						  </span>
                            <button type="button" data-dismiss="modal" className="btn btn-primary float-right"
                                    data-toggle="modal" data-target="#regmodal" onClick={switchFn}>Registrace
                            </button>
                        </FormCheck>
                    </Modal.Footer>
                </Modal>

        );
    }
}