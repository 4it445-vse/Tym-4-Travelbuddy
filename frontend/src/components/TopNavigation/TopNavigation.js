import React, {Component} from 'react';
import {Link} from 'react-router';
import {Modal} from 'react-bootstrap';
import axios from '../../api';

export class TopNavigation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            showLoginModal: false,
            showRegisterModal: false,
            buddies: [],
            registrationValidation: {//TODO change to undefined values
                /*
                 name: 'Karel',
                 surname: 'Omáčka',
                 email: 'undefined',
                 city: 'Praha',
                 pass: 'heslo',
                 pass_repeated: 'heslo',
                 agreed_with_conditions: true
                 */
                name: 'undefined',
                surname: 'undefined',
                email: 'undefined',
                city: 'undefined',
                pass: 'undefined',
                pass_repeated: 'undefined',
                agreed_with_conditions: false
            }
        };

        this.closeLogin = this.closeLogin.bind(this);
        this.openLogin = this.openLogin.bind(this);
        this.closeRegister = this.closeRegister.bind(this);
        this.openRegister = this.openRegister.bind(this);
        this.handleSubmitLogIn = this.handleSubmitLogIn.bind(this);
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

    openLogin() {
        this.closeRegister();
        this.setState({showLoginModal: true});
    }

    closeLogin() {
        this.setState({showLoginModal: false});
    }

    openRegister() {
        this.closeLogin();
        this.setState({showRegisterModal: true});
    }

    closeRegister() {
        this.setState({showRegisterModal: false});
    }

    handleSubmitLogIn(event) {
        var email = document.getElementById("email-l").value;
        var pass = document.getElementById("pass-l").value;

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
                alert("success");
            } else {
                alert("failure");
            }
        });
    }

    handleSubmitRegistration(event) {
        let validated = true;
        console.log(this.state.registrationValidation);
        for (var prop in this.state.registrationValidation) {
            console.log(this.state.registrationValidation[prop]);
            if (!this.state.registrationValidation[prop]) {
                validated = false;
                console.log("set to false");
            }
        }
        if (!validated) {
            alert("failure");
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
            alert("given email already used");
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
                    alert("given email already used");
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
                        alert('success');
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
                    this.state.registrationValidation[name] = 'undefined';
                }
                break;
            case "email":
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                    this.state.registrationValidation[name] = value;
                } else {
                    this.state.registrationValidation[name] = 'undefined';
                }
                break;
            case "pass":
                var passw = /^[A-Za-z]\w{7,14}$/;
                if (value.match(passw)) {
                    this.state.registrationValidation[name] = value;
                } else {
                    this.state.registrationValidation[name] = 'undefined';
                }
                break;
            case "pass_repeated":
                if (this.state.registrationValidation.pass && value === document.getElementById("pass").value) {
                    this.state.registrationValidation[name] = value;
                } else {
                    this.state.registrationValidation[name] = 'undefined';
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
        return (
            <div>
                <nav className="navbar navbar-static-top navbar-dark bg-primary">
                    <a className="navbar-brand hidden-md-down" href="#">Travel Buddy</a>
                    <a className="navbar-brand float-md-right float-sm-right float-xl-right float-xs-right hidden-lg-up"
                       href="#">Travel Buddy</a>
                    <button className="navbar-toggler hidden-lg-up" type="button" data-toggle="collapse"
                            data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
                            aria-label="Toggle navigation"></button>
                    <div className="collapse navbar-toggleable-md" id="navbarResponsive">
                        <ul className="nav navbar-nav float-lg-right">
                            <li className="nav-item">
                                <Link className="nav-link" href="#" onClick={this.openRegister}>Registrovat se</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="#" onClick={this.openLogin}>Přihlásit se</Link>
                            </li>
                        </ul>
                    </div>
                </nav>

                <Modal show={this.state.showLoginModal} onHide={this.closeLogin}>
                    <Modal.Header closeButton>
                        <Modal.Title>Přihlášení</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="form-group">
                                <input type="email" name="email" className="form-control" id="email-l"
                                       placeholder="Váš email"/>
                            </div>
                            <div className="form-group">
                                <input type="password" name="password" className="form-control" id="pass-l"
                                       placeholder="Heslo"/>
                            </div>
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
                            <div className="form-group">
                                <button onClick={this.handleSubmitLogIn} type="button"
                                        className="btn btn-primary fullsize v-o-5">Přihlásit
                                </button>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="form-check">
              <span className="float-left">
                  Nemáš ještě účet?
              </span>
                            <button type="button" data-dismiss="modal" className="btn btn-primary float-right"
                                    data-toggle="modal" data-target="#regmodal" onClick={this.openRegister}>Registrace
                            </button>
                        </div>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showRegisterModal} onHide={this.closeRegister}>
                    <Modal.Header closeButton>
                        <Modal.Title>Registrace</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.handleSubmitRegistration}>
                            <div className="form-group">
                                <input onBlur={this.validate} type="text" className="form-control" id="name"
                                       placeholder="Jméno"/>
                            </div>
                            <div className="form-group">
                                <input onBlur={this.validate} type="text" className="form-control" id="surname"
                                       placeholder="Příjmení"/>
                            </div>
                            <div className="form-group">
                                <input onBlur={this.validate} type="email" className="form-control" id="email"
                                       placeholder="Email"/>
                            </div>
                            <div className="form-group">
                                <input onBlur={this.validate} type="text" className="form-control" id="city"
                                       placeholder="Město"/>
                            </div>
                            <div className="form-group">

                                <input onBlur={this.validate} type="password" className="form-control" id="pass"
                                       placeholder="Heslo"/>
                            </div>
                            <div className="form-group">
                                <input onBlur={this.validate} type="password" className="form-control"
                                       id="pass_repeated" placeholder="Heslo znovu"/>
                            </div>
                            <div className="form-check">
                                <label className="form-check-label float-left">
                                    <input onClick={this.validate} id="agreed_with_conditions" type="checkbox"
                                           className="form-check-input"/>
                                    Souhlasím s podmínkami
                                </label>
                                <button onClick={this.handleSubmitRegistration} type="button"
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
                                    data-toggle="modal" data-target="#regmodal" onClick={this.openLogin}>Přihlášení
                            </button>
                        </div>
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }
}
