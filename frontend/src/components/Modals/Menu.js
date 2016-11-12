import React, {Component} from "react";
import {Link} from "react-router";
import {Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem} from "reactstrap";
import currentUser from "../../actions/CurrentUser";

export default class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: true
        };

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    logOut() {
        console.log("logout success");
        currentUser.setCurrentUser(undefined)
        this.setState(this.state);
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        const {openEdit, openRegister, openLogin} = this.props;
        const loggedUser = currentUser.getCurrentUser();
        const userLogged = !!loggedUser;
        return (
            <Navbar className="bg-primary row" dark>
                <div className="col-xs-7 col-md-3 text-xs-left">
                    <NavbarBrand href="/">Travel Buddy</NavbarBrand>
                </div>
                <div className="col-xs-5 col-md-9 text-xs-right">
                    <NavbarToggler className="hidden-lg-up collapsed" onClick={this.toggleNavbar}/>
                </div>
                <Collapse className="navbar-toggleable-md" isOpen={!this.state.collapsed}>
                    <Nav navbar className="float-lg-right text-xs-center">
                        {userLogged ? <NavItem>
                            <Link href="#" className="nav-link" onClick={openEdit}>Editovat profil</Link>
                        </NavItem> : ""}
                        {userLogged ? <NavItem>
                            <Link href="#" className="nav-link" onClick={this.logOut}>Odhlaš se</Link>
                        </NavItem> : ""}
                        {userLogged ? "" : <NavItem>
                            <Link href="#" className="nav-link" onClick={openRegister}>Registrovat se</Link>
                        </NavItem>}
                        {userLogged ? "" : <NavItem>
                            <Link href="#" className="nav-link" onClick={openLogin}>Přihlásit se</Link>
                        </NavItem>}
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}
