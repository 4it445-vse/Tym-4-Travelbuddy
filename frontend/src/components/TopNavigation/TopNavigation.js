import React, { Component } from 'react';
import classname from 'classnames';
import { Link } from 'react-router';
import { Navbar, Nav, NavItem, Modal, Button } from 'react-bootstrap';
import { LoginModal } from '../Modals/LoginModal.js'

export class TopNavigation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showLoginModal: false,
      showRegisterModal: false,
    };

    this.closeLogin = this.closeLogin.bind(this);
    this.openLogin = this.openLogin.bind(this);
    this.closeRegister = this.closeRegister.bind(this);
    this.openRegister = this.openRegister.bind(this);
  }

  closeLogin() {
    this.setState({ showLoginModal: false });
  }

  closeRegister() {
    this.setState({ showRegisterModal: false });
  }

  openLogin() {
    this.setState({ showLoginModal: true });
  }

  openRegister() {
    this.setState({ showRegisterModal: true });
  }

  render() {
    const { showLoginModal, showRegisterModal } = this.state;
    return (
      <div>
        <nav className="navbar navbar-static-top navbar-dark bg-primary">
            <a className="navbar-brand hidden-md-down" href="#">Travel Buddy</a>
            <a className="navbar-brand float-md-right float-sm-right float-xl-right float-xs-right hidden-lg-up" href="#">Travel Buddy</a>
            <button className="navbar-toggler hidden-lg-up" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"></button>
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

      <Modal show={this.state.showLoginModal} onHide={this.closeLogin} >
        <Modal.Header closeButton>
          <Modal.Title>Přihlášení</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
              <div className="form-group">
                  <input type="email" className="form-control" id="email" placeholder="Váš email"/>
              </div>
              <div className="form-group">
                  <input type="password" className="form-control" id="pass" placeholder="Heslo"/>
              </div>
              <div className="modal-group">
                  <div className="form-check">
                      <label className="form-check-label float-left">
                          <input type="checkbox" className="form-check-input"/>
                          Zapamatovat si mě
                      </label>
                      <a href="#" className="float-right" data-dismiss="modal" data-toggle="modal" data-target="#zapommodal">Zapomenuté heslo?</a>
                  </div>

              </div>
              <div className="form-group">
                  <button type="button" className="btn btn-primary fullsize v-o-5" >Přihlásit</button>
              </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="form-check">
              <span className="float-left">
                  Nemáš ještě účet?
              </span>
              <button type="button" data-dismiss="modal" className="btn btn-primary float-right" data-toggle="modal" data-target="#regmodal"  href="#">Registrace</button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal show={this.state.showRegisterModal} onHide={this.closeRegister} >
        <Modal.Header closeButton>
          <Modal.Title>Registrace</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
              <div className="form-group">
                  <input type="text" className="form-control" id="name" placeholder="Jméno"/>
              </div>
              <div className="form-group">
                  <input type="text" className="form-control" id="surname" placeholder="Příjmení"/>
              </div>
              <div className="form-group">
                  <input type="email" className="form-control" id="email" placeholder="Email"/>
              </div>
              <div className="form-group">
                  <input type="text" className="form-control" id="city" placeholder="Město"/>
              </div>
              <div className="form-group">

                  <input type="password" className="form-control" id="pass" placeholder="Heslo"/>
              </div>
              <div className="form-group">
                  <input type="password" className="form-control" id="pass1" placeholder="Heslo znovu"/>
              </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="form-check">
              <label className="form-check-label float-left" >
                  <input type="checkbox" className="form-check-input"/>
                  Souhlasím s podmínkami
              </label>
              <button type="button" className="btn btn-primary float-right" >Registrovat</button>
          </div>
        </Modal.Footer>
      </Modal>

      </div>
    );
  }
}
