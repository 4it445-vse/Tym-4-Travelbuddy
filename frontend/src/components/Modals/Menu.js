import React, {Component} from "react";
import {Link} from "react-router";
import {Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem} from "reactstrap";
import currentUser from "../../actions/CurrentUser";

export default class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            collapsedMyTravelling: true
        };

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.logOut = this.logOut.bind(this);
        this.setCollapsedMyTravelling = this.setCollapsedMyTravelling.bind(this);
    }

    setCollapsedMyTravelling() {
        console.log("### is called", this.state.collapsedMyTravelling);
        this.setState({collapsedMyTravelling: (this.state.collapsedMyTravelling === false)});
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
        const {openEdit, openRegister, openLogin, openNewRequest, openEditRequests} = this.props;
        const loggedUser = currentUser.getCurrentUser();
        const userLogged = !!loggedUser;
        console.log("in render", this.state.collapsedMyTravelling);
        return (
            <Navbar className="bg-primary row" dark>
                <div className="col-xs-9 col-md-3 text-xs-left">
                    <NavbarBrand href="/">Travel Buddy</NavbarBrand>
                </div>
                <div className="col-xs-3 col-md-9 text-xs-right">
                    <NavbarToggler className="hidden-lg-up collapsed pointer" onClick={this.toggleNavbar}/>
                </div>
                <Collapse className="navbar-toggleable-md" isOpen={!this.state.collapsed}>
                    <Nav navbar className="float-lg-right text-xs-center">
                        {userLogged ?
                            <div>
                                <NavItem className="margin-right-30">
                                    <Link href="/" className="nav-link">Seznam budíků</Link>
                                </NavItem>
                                <hr className="xs-visible sm-visible hidden-md-up hidden-lg-up"/>
                                <NavItem className="margin-right-30">
                                    <Link href="/requests" className="nav-link">Seznam jízd</Link>
                                </NavItem>
                                <hr className="xs-visible sm-visible hidden-md-up hidden-lg-up"/>
                                <NavItem className="margin-right-30">
                                    <li className={this.state.collapsedMyTravelling ? "nav-item dropdown" : "nav-item dropdown open"}>
                                        <a className="nav-link dropdown-toggle"
                                           href="#" id="supportedContentDropdown"
                                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                           onClick={this.setCollapsedMyTravelling}
                                           >Moje
                                            cestování</a>
                                        <div className="dropdown-menu">
                                            <a className="dropdown-item" onClick={openNewRequest}>Zadat novou cestu</a>
                                            <a className="dropdown-item" onClick={openEditRequests}>Editovat cestu</a>
                                        </div>
                                    </li>
                                </NavItem>
                                <hr className="xs-visible sm-visible hidden-md-up hidden-lg-up"/>
                                <NavItem className="margin-right-30">
                                    <Link href="/messages" className="nav-link" role="tab" data-toggle="tab">Pošta&nbsp;
                                        {this.state.incomingUnreadMessagesNum > 0 ?
                                            <span
                                                className="label label-success">{this.state.incomingUnreadMessagesNum}</span>
                                            : ""}
                                    </Link>
                                </NavItem>
                                <hr className="xs-visible sm-visible hidden-md-up hidden-lg-up"/>
                                <NavItem className="margin-right-30">
                                    <Link href="#" className="nav-link" onClick={openEdit}>Editovat profil</Link>
                                </NavItem>
                                <hr className="xs-visible sm-visible hidden-md-up hidden-lg-up"/>
                                <NavItem>
                                    <Link href="#" className="nav-link" onClick={this.logOut}>Odhlaš se</Link>
                                </NavItem>
                            </div>
                            : ""
                        }
                        {userLogged ? "" :
                            <div>
                                <NavItem className="margin-right-30">
                                    <Link href="#" className="nav-link" onClick={openRegister}>Registrovat se</Link>
                                </NavItem>
                                <NavItem>
                                    <Link href="#" className="nav-link" onClick={openLogin}>Přihlásit se</Link>
                                </NavItem>
                            </div>
                        }
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}
