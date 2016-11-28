import React, {Component} from "react";
import {Link} from "react-router";
import {Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem} from "reactstrap";
import currentUser from "../../actions/CurrentUser";
import axios from "../../api"

export default class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
			incomingUnreadMessagesNum: 0
        };

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.logOut = this.logOut.bind(this);
        this.countIncomingUnreadMessages = this.countIncomingUnreadMessages.bind(this);
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
	
	countIncomingUnreadMessages() {
		axios.get('messages', {
		params: {
			filter: {
				where: {
					"buddy_id_to": currentUser.getCurrentUser().id
				}
			}
		}
		}).then(response => {
			let buddyMessages = response.data;
			let incomingUnreadMessagesNum = 0;
			buddyMessages.map(message => {
				if(message.displayed === false){
					incomingUnreadMessagesNum++; 
				}
			});
			
			this.setState({
				incomingUnreadMessagesNum: incomingUnreadMessagesNum
			});
		});
	}

    render() {
        const {openEdit, openRegister, openLogin, openNewRequest, openEditRequests} = this.props;
        const loggedUser = currentUser.getCurrentUser();
        const userLogged = !!loggedUser;
		if(userLogged){
			this.countIncomingUnreadMessages();
		}
		
        return (
            <Navbar className="navbar-fixed-top bg-primary row" dark>
                <div className="col-xs-7 col-md-3 text-xs-left">
                    <NavbarBrand href="/">Travel Buddy</NavbarBrand>
                </div>
                <div className="col-xs-5 col-md-9 text-xs-right">
                    <NavbarToggler className="hidden-lg-up collapsed" onClick={this.toggleNavbar}/>
                </div>
                <Collapse className="navbar-toggleable-md" isOpen={!this.state.collapsed}>
                    <Nav navbar className="float-lg-right text-xs-center">

                        {userLogged ? <NavItem className="margin-right-50">
                            <Link href="/messages" className="nav-link" role="tab" data-toggle="tab">Pošta 
							{this.state.incomingUnreadMessagesNum > 0 ?
								<span className="label label-success"> {this.state.incomingUnreadMessagesNum}</span>
								 : ""}
							</Link>
                        </NavItem> : ""}
						<hr className="xs-visible sm-visible hidden-md-up hidden-lg-up"/>
                        {userLogged ? <NavItem>
                            <Link href="/" className="nav-link">Seznam budíků</Link>
                        </NavItem> : ""}
                        {userLogged ? <NavItem className="margin-right-50">
                            <Link href="/requests" className="nav-link">Seznam jízd</Link>
                        </NavItem> : ""}
                        <hr className="xs-visible sm-visible hidden-md-up hidden-lg-up"/>
                        {userLogged ? <NavItem className="strongNavItem">
                            <Link href="#" className="nav-link" onClick={openNewRequest}>Chci někam jet!</Link>
                        </NavItem> : ""}
                        {userLogged ? <NavItem className="margin-right-50">
                            <Link href="#" className="nav-link" onClick={openEditRequests}>Editovat moje jízdy</Link>
                        </NavItem> : ""}
                        <hr className="xs-visible sm-visible hidden-md-up hidden-lg-up"/>
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
