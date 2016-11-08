import React, { Component } from 'react';
import { Link } from 'react-router';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Modal } from 'react-bootstrap';
import axios from '../../api';
import currentUser from '../../actions/CurrentUser.js';

export class TopNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            email: '',
            password: '',
            showLoginModal: false,
            showRegisterModal: false,
            userLogged: false,
            showEditModal: false,
            currentUserIsHosting: false,
            currentUserHelper: {},
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

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.closeLogin = this.closeLogin.bind(this);
        this.openLogin = this.openLogin.bind(this);
        this.closeRegister = this.closeRegister.bind(this);
        this.openRegister = this.openRegister.bind(this);
        this.handleSubmitLogIn = this.handleSubmitLogIn.bind(this);
        this.handleSubmitRegistration = this.handleSubmitRegistration.bind(this);
        this.validate = this.validate.bind(this);
        this.logOut = this.logOut.bind(this);
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
        this.onChangeCity = this.onChangeCity.bind(this);
        currentUser.setLogIn(this.openLogin);
    }

    onChangeCity(event) {
        var name = event.target.id;
        var value = event.target.value;
        this.setState({
            currentUserHelper: {
                name: value
            }
        });
    }

    componentDidMount() {
        axios.get('buddies')
            .then(response => {
                this.setState({
                    buddies: response.data,
                });
            });
    }

    toggleNavbar() {
      this.setState({
        collapsed: !this.state.collapsed
      });
    }

    logOut() {
        console.log("logout success");
        currentUser.setCurrentUser(undefined);
        this.setState({
            userLogged: false
        });
    }

    openEdit() {
        this.closeRegister();
        this.setState({showEditModal: true});
    }

    closeEdit() {
        this.setState({showEditModal: false});
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
                console.log("login success");
                currentUser.setCurrentUser(response.data[0]);
                this.closeLogin();
                this.setState({
                    userLogged: true,
                    currentUserHelper: {
                        about_me: response.data[0].about_me ? response.data[0].about_me : "",
                        city: response.data[0].city,
                        is_hosting: response.data[0].is_hosting
                    }
                });
            } else {
                console.log("login failure");
            }
        });
    }

    handleSubmitRegistration(event) {
        let validated = true;
        for (var prop in this.state.registrationValidation) {
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
                        this.closeRegister();
                    });
                }
            });

        }
    }

    handleSubmitEdit() {
        var city = document.getElementById("city").value;
        var about_me = document.getElementById("about_me").value;
        var is_hosting = document.getElementById("is_hosting").checked;
        var sex;
        if (!currentUser.getCurrentUser().sex) {
            let e = document.getElementById("sex");
            sex = e.options[e.selectedIndex].value;
        } else {
            sex = currentUser.getCurrentUser().sex;
        }
        if (city) {
            let currentUserLocal = currentUser.getCurrentUser();
            let constructedBuddy = {
                "email": currentUser.getCurrentUser().email,
                "password": currentUser.getCurrentUser().password,
                "sex": sex,
                "city": city,
                "is_hosting": is_hosting,
                "about_me": about_me,
                "name": currentUser.getCurrentUser().name,
                "surname": currentUser.getCurrentUser().surname,
                "id": currentUser.getCurrentUser().id

            };
            axios.put('buddies/' + currentUser.getCurrentUser().id, constructedBuddy).then(response => {
                console.log('registration success');
                this.closeEdit();
                currentUser.setCurrentUser(constructedBuddy);
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
        const loggedUser = currentUser.getCurrentUser();
        const userLogged = !! loggedUser;
        console.log("called render");
        console.log("helper: ", this.state.currentUserHelper);
        return (
            <div>
            <Navbar className="bg-primary" dark>
              <NavbarBrand href="/">Travel Buddy</NavbarBrand>
              <NavbarToggler className="float-sm-right float-lg-right hidden-lg-up collapsed" onClick={this.toggleNavbar} />
              <Collapse className="navbar-toggleable-md" isOpen={!this.state.collapsed}>
                <Nav navbar className="float-lg-right">
                  <NavItem className="nav-item">
                      <Link href="#" className="nav-link" onClick={this.openEdit}>Editovat profil</Link>
                  </NavItem>
                  {userLogged ? <NavItem className="nav-item">
                      <Link href="#" className="nav-link" onClick={this.openEdit}>Editovat profil</Link>
                  </NavItem>  : ""}
                  {userLogged ? <NavItem className="nav-item">
                      <Link href="#" className="nav-link" onClick={this.logOut}>Odhlaš se</Link>
                  </NavItem> : ""}
                  {userLogged ? "" : <NavItem className="nav-item">
                      <Link href="#" className="nav-link" onClick={this.openRegister}>Registrovat se</Link>
                  </NavItem>}
                  {userLogged ? "" : <NavItem className="nav-item">
                      <Link href="#" className="nav-link" onClick={this.openLogin}>Přihlásit se</Link>
                  </NavItem>}
                </Nav>
              </Collapse>
            </Navbar>

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

                { userLogged ?
                    <Modal show={this.state.showEditModal} onHide={this.closeEdit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Editace profilu - {loggedUser.name} {loggedUser.surname}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={this.handleSubmitRegistration}>
                                { loggedUser.sex ? "" :
                                    <div className="form-group">
                                        Pohlaví:
                                        <select className="form-control" id="sex">
                                            <option value="male">Muž</option>
                                            <option value="female">Žena</option>
                                        </select>
                                    </div>}
                                <div className="form-group">
                                    Hostuji:
                                    <input type="checkbox" className="form-control" id="is_hosting"
                                    />
                                </div>
                                <div className="form-group">
                                    <input onChange={this.onChangeCity} type="text" className="form-control" id="city"
                                           value={this.state.currentUserHelper.city}/>
                                </div>
                                <div className="form-group">
                                <textarea onChange={this.onChangeCity} type="text" className="form-control"
                                          id="about_me"
                                          value={this.state.currentUserHelper.about_me}/>
                                </div>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="form-check">
                                <button onClick={this.handleSubmitEdit} type="button"
                                        className="btn btn-primary fullsize v-o-5">Uložit
                                </button>
                            </div>
                        </Modal.Footer>
                    </Modal>
                : ""}
            </div>
        );
    }
}
