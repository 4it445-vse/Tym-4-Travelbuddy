import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import FormGroup from "./FormGroup";
import FormCheck from "./FormCheck";
import axios from "../../api";

export default class RegisterModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            buddies: [],
            registrationValidation: {
                /*
                 name: 'Karel',
                 surname: 'Omáčka',
                 email: 'special@email2.cz',
                 city: 'Praha',
                 pass: false,
                 pass_repeated: false,
                 agreed_with_conditions: true
                 */
                name: undefined,
                surname: undefined,
                email: undefined,
                city: undefined,
                pass: undefined,
                pass_repeated: undefined,
                agreed_with_conditions: false
            },
            isFieldValid: {
                name: false,
                surname: false,
                email: false,
                city: false,
                pass: false,
                pass_repeated: false,
                agreed_with_conditions: false
            },
            showValidation: false,
        };

        this.handleSubmitRegistration = this.handleSubmitRegistration.bind(this);
        this.validate = this.validate.bind(this);
    }

    componentDidMount() {
        axios.get('buddies')
            .then(response => {
                this.setState({
                    buddies: response.data,
                });
            });
    }

    handleSubmitRegistration(event) {
        let validated = true;
        for (var prop in this.state.registrationValidation) {
            if (!this.state.registrationValidation[prop]) {
                validated = false;
                break;
            }
        }
        if (!validated) {
            this.setState({showValidation: true});
            return;
        }
        var name = this.state.registrationValidation.name;
        var surname = this.state.registrationValidation.surname;
        var email = this.state.registrationValidation.email;
        var city = this.state.registrationValidation.city;
        var pass = this.state.registrationValidation.pass;

        var buddy = this.state.buddies.find((v) => {
            if (v.email === email) {
                return v;
            }
        });
        if (buddy) {
            var isFieldValid = this.state.isFieldValid;
            isFieldValid["email"] = "emailAlreadyExists";
            this.setState({isFieldValid: isFieldValid});
        } else {
            axios.get('buddies', {
                params: {
                    filter: {
                        where: {
                            email: email,
                        },
                    },
                }
            }).then(response => {
                if (response.data && response.data[0] && response.data[0].password === pass) {
                    alert("Email již zadán");
                } else {
                    axios.post('buddies', {
                        "email": email,
                        "password": pass,
                        "sex": "na",
                        "name": name,
                        "surname": surname,
                        "city": city,
                        "is_hosting": false

                    }).then(response => {
                        console.log('registration success');
                        this.setState({
                            isFieldValid: {
                                name: false,
                                surname: false,
                                email: false,
                                city: false,
                                pass: false,
                                pass_repeated: false,
                                agreed_with_conditions: false
                            },
                            showValidation: false
                        });
                        this.props.hideFn();
                        this.setState({
                            registrationValidation: {
                                name: undefined,
                                surname: undefined,
                                email: undefined,
                                city: undefined,
                                pass: undefined,
                                pass_repeated: undefined,
                                agreed_with_conditions: false
                            }
                        });
                    });
                }
            });

        }
    }

    validate(event) {
        var value = event.target.value;
        var name = event.target.id;
        var isFieldValid = this.state.isFieldValid;
        switch (name) {
            case "name":
            case "surname":
            case "city":
                if (value) {
                    this.state.registrationValidation[name] = value;
                    isFieldValid[name] = true;
                } else {
                    this.state.registrationValidation[name] = undefined;
                    isFieldValid[name] = false;
                }
                break;
            case "email":
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                    this.state.registrationValidation[name] = value;
                    isFieldValid[name] = isFieldValid[name] == 'emailAlreadyExists' ? 'emailAlreadyExists' : true;
                } else {
                    this.state.registrationValidation[name] = undefined;
                    isFieldValid[name] = false;
                }
                break;
            case "pass":
                var passw = /^[A-Za-z]\w{7,14}$/;
                if (value.match(passw)) {
                    this.state.registrationValidation[name] = value;
                    isFieldValid[name] = true;
                } else {
                    this.state.registrationValidation[name] = undefined;
                    isFieldValid[name] = false;
                }
                break;
            case "pass_repeated":
                if (this.state.registrationValidation.pass && value === this.state.registrationValidation.pass) {
                    this.state.registrationValidation[name] = value;
                    isFieldValid[name] = true;
                } else {
                    this.state.registrationValidation[name] = undefined;
                    isFieldValid[name] = false;
                }
                break;
            case "agreed_with_conditions":
                value = event.target.checked;
                if (value) {
                    this.state.registrationValidation[name] = true;
                    isFieldValid[name] = true;
                } else {
                    this.state.registrationValidation[name] = false;
                    isFieldValid[name] = false;
                }
                break;
            default:
        }
        this.setState({isFieldValid: isFieldValid});
    }

    render() {
        const {showProp, hideFn, submitFn, switchFn} = this.props;
        const title = "Registrace";
        return (
            <Modal show={showProp} onHide={hideFn}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormGroup>
                            {
                                this.state.showValidation
                                && !this.state.isFieldValid.name
                                    ? <span className="validation-error">Zadejte prosím jméno</span>
                                    : ""
                            }
                            <input
                                onBlur={this.validate}
                                type="text"
                                className={
                                    "form-control"
                                    + (
                                        this.state.showValidation
                                        && !this.state.isFieldValid.name
                                            ? ' alert-danger'
                                            : ''
                                    )
                                }
                                id="name"
                                placeholder="Jméno"
                            />
                        </FormGroup>
                        <FormGroup>
                            {
                                this.state.showValidation
                                && !this.state.isFieldValid.surname
                                    ? <span className="validation-error">Zadejte prosím příjmení</span>
                                    : ""
                            }
                            <input
                                onBlur={this.validate}
                                type="text"
                                className={
                                    "form-control"
                                    + (
                                        this.state.showValidation
                                        && !this.state.isFieldValid.surname
                                            ? ' alert-danger'
                                            : ''
                                    )
                                }
                                id="surname"
                                placeholder="Příjmení"
                            />
                        </FormGroup>
                        <FormGroup>
                            {
                                this.state.showValidation
                                && !this.state.isFieldValid.email
                                    ? <span className="validation-error">Zadejte prosím email ve správném formátu</span>
                                    : ""
                            }
                            {
                                this.state.showValidation
                                && this.state.isFieldValid.email === 'emailAlreadyExists'
                                    ? <span className="validation-error">Uživatel s tímto emailem je již u nás registrován</span>
                                    : ""
                            }
                            <input
                                onBlur={this.validate}
                                type="email"
                                className={
                                    "form-control"
                                    + (
                                        this.state.showValidation
                                        && !this.state.isFieldValid.email
                                            ? ' alert-danger'
                                            : ''
                                    )
                                }
                                id="email"
                                placeholder="Email"
                            />
                        </FormGroup>
                        <FormGroup>
                            {
                                this.state.showValidation
                                && !this.state.isFieldValid.city
                                    ? <span className="validation-error">Zadejte prosím město</span>
                                    : ""
                            }
                            <input
                                onBlur={this.validate}
                                type="text"
                                className={
                                    "form-control"
                                    + (
                                        this.state.showValidation
                                        && !this.state.isFieldValid.city
                                            ? ' alert-danger'
                                            : ''
                                    )
                                }
                                id="city"
                                placeholder="Město"
                            />
                        </FormGroup>
                        <FormGroup>
                            {
                                this.state.showValidation
                                && !this.state.isFieldValid.pass
                                    ? <span className="validation-error">Zadejte prosím heslo o minimální délce 8</span>
                                    : ""
                            }
                            <input
                                onBlur={this.validate}
                                type="password"
                                className={
                                    "form-control"
                                    + (
                                        this.state.showValidation
                                        && this.state.isFieldValid.pass === false
                                            ? ' alert-danger'
                                            : ''
                                    )
                                }
                                id="pass"
                                placeholder="Heslo"
                            />
                        </FormGroup>
                        <FormGroup>
                            {
                                this.state.showValidation
                                && !this.state.isFieldValid.pass_repeated
                                    ? <span className="validation-error">Zadaná hesla nesouhlasí</span>
                                    : ""
                            }
                            <input
                                onBlur={this.validate}
                                type="password"
                                className={
                                    "form-control"
                                    + (
                                        this.state.showValidation
                                        && this.state.isFieldValid.pass_repeated === false
                                            ? ' alert-danger'
                                            : ''
                                    )
                                }
                                id="pass_repeated"
                                placeholder="Heslo znovu"
                            />
                        </FormGroup>
                        <FormCheck>
                            {
                                this.state.showValidation
                                && !this.state.isFieldValid.agreed_with_conditions
                                    ? <p className="validation-error no-margin">Musíte souhlasit s podmínkami služby</p>
                                    : ""
                            }
                            <label className="form-check-label float-left">
                                <input onClick={this.validate} id="agreed_with_conditions" type="checkbox"
                                       className="form-check-input"/>
                                Souhlasím s podmínkami
                            </label>
                            <button onClick={this.handleSubmitRegistration} type="button"
                                    className="btn btn-primary fullsize v-o-5">Registrovat
                            </button>
                        </FormCheck>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <FormCheck>
					  <span className="float-left">
						  Již máš účet?
					  </span>
                        <button type="button" data-dismiss="modal" className="btn btn-primary float-right"
                                data-toggle="modal" data-target="#regmodal" onClick={switchFn}>Přihlášení
                        </button>
                    </FormCheck>
                </Modal.Footer>
            </Modal>

        );
    }
}