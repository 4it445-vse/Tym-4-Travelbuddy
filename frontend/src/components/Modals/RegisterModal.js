import React, {Component} from 'react';
import { Modal } from 'react-bootstrap';

export default class RegisterModal extends Component {
    render(){
        const {showProp, hideFn, submitFn, validateFn, switchFn} = this.props;
        const title = "Registrace";
        return(
            <Modal show={showProp} onHide={hideFn}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={this.handleSubmitRegistration}>
                        <div className="form-group">
                            <input onBlur={validateFn} type="text" className="form-control" id="name"
                                   placeholder="Jméno"/>
                        </div>
                        <div className="form-group">
                            <input onBlur={validateFn} type="text" className="form-control" id="surname"
                                   placeholder="Příjmení"/>
                        </div>
                        <div className="form-group">
                            <input onBlur={validateFn} type="email" className="form-control" id="email"
                                   placeholder="Email"/>
                        </div>
                        <div className="form-group">
                            <input onBlur={validateFn} type="text" className="form-control" id="city"
                                   placeholder="Město"/>
                        </div>
                        <div className="form-group">

                            <input onBlur={validateFn} type="password" className="form-control" id="pass"
                                   placeholder="Heslo"/>
                        </div>
                        <div className="form-group">
                            <input onBlur={validateFn} type="password" className="form-control"
                                   id="pass_repeated" placeholder="Heslo znovu"/>
                        </div>
                        <div className="form-check">
                            <label className="form-check-label float-left">
                                <input onClick={validateFn} id="agreed_with_conditions" type="checkbox"
                                       className="form-check-input"/>
                                Souhlasím s podmínkami
                            </label>
                            <button onClick={submitFn} type="button"
                                    className="btn btn-primary fullsize v-o-5">Registrovat
                            </button>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <div className="form-check">
              <span className="float-left">
                  Již máš účet?
              </span>
                        <button type="button" data-dismiss="modal" className="btn btn-primary float-right"
                                data-toggle="modal" data-target="#regmodal" onClick={switchFn}>Přihlášení
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>

        );
    }
}