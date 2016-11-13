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
            }
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
        var failedFields = "";
        for (var prop in this.state.registrationValidation) {
            if (!this.state.registrationValidation[prop]) {
                validated = false;
                failedFields += " " + prop;
            }
        }
        if (!validated) {
            alert("failure" + failedFields);
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
            alert("Email již zadán");
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
        switch (name) {
            case "name":
            case "surname":
            case "city":
                if (value) {
                    this.state.registrationValidation[name] = value;
                } else {
                    this.state.registrationValidation[name] = undefined;
                }
                break;
            case "email":
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                    this.state.registrationValidation[name] = value;
                } else {
                    this.state.registrationValidation[name] = undefined;
                }
                break;
            case "pass":
                var passw = /^[A-Za-z]\w{7,14}$/;
                if (value.match(passw)) {
                    this.state.registrationValidation[name] = value;
                } else {
                    this.state.registrationValidation[name] = undefined;
                }
                break;
            case "pass_repeated":
                console.log(this.state.registrationValidation.pass);
                console.log(document.getElementById("pass_repeated").value);
                console.log(this.state.registrationValidation.pass && value === this.state.registrationValidation.pass);
                if (this.state.registrationValidation.pass && value === this.state.registrationValidation.pass) {
                    console.log("in here");
                    this.state.registrationValidation[name] = value;
                } else {
                    this.state.registrationValidation[name] = undefined;
                }
                break;
            case "agreed_with_conditions":
                value = event.target.checked;
                if (value) {
                    this.state.registrationValidation[name] = true;
                } else {
                    this.state.registrationValidation[name] = false;
                }
                break;
            default:
        }
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
                            <input onBlur={this.validate} type="text" className="form-control" id="name"
                                   placeholder="Jméno"/>
                        </FormGroup>
                        <FormGroup>
                            <input onBlur={this.validate} type="text" className="form-control" id="surname"
                                   placeholder="Příjmení"/>
                        </FormGroup>
                        <FormGroup>
                            <input onBlur={this.validate} type="email" className="form-control" id="email"
                                   placeholder="Email"/>
                        </FormGroup>
                        <FormGroup>
                            <input onBlur={this.validate} type="text" className="form-control" id="city"
                                   placeholder="Město"/>
                        </FormGroup>
                        <FormGroup>

                            <input onBlur={this.validate} type="password" className="form-control" id="pass"
                                   placeholder="Heslo"/>
                        </FormGroup>
                        <FormGroup>
                            <input onBlur={this.validate} type="password" className="form-control"
                                   id="pass_repeated" placeholder="Heslo znovu"/>
                        </FormGroup>
                        <FormCheck>
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