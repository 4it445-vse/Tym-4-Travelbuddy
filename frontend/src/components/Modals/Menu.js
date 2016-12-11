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
            collapsedMyTravelling: true
        };

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.logOut = this.logOut.bind(this);
        this.countIncomingUnreadMessages = this.countIncomingUnreadMessages.bind(this);
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
                                <Link href="/messages" className="nav-link" role="tab" data-toggle="tab">Messages {this.state.incomingUnreadMessagesNum > 0 ?<span className="label label-success"> {this.state.incomingUnreadMessagesNum}</span>
								 : ""}
							</Link>
                        </NavItem>
						<hr className="xs-visible sm-visible hidden-md-up hidden-lg-up"/>
<NavItem className="margin-right-30">
<Link href="/" className="nav-link">All Buddies</Link>
                                </NavItem>
                                <hr className="xs-visible sm-visible hidden-md-up hidden-lg-up"/>
                                <NavItem className="margin-right-30">
                                    <Link href="/requests" className="nav-link">All Requests</Link>
                                </NavItem>
                                <hr className="xs-visible sm-visible hidden-md-up hidden-lg-up"/>
                                <NavItem className="margin-right-30">
                                    <li className={this.state.collapsedMyTravelling ? "nav-item dropdown" : "nav-item dropdown open"}>
                                        <a className="nav-link dropdown-toggle"
                                           href="#" id="supportedContentDropdown"
                                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                           onClick={this.setCollapsedMyTravelling}
                                           >My travels
                                            cestování</a>
                                        <div className="dropdown-menu">
                                            <a className="dropdown-item" onClick={openNewRequest}>Create New Request</a>
                                            <a className="dropdown-item" onClick={openEditRequests}>Edit My Requests</a>
                                        </div>
                                    </li>
                                </NavItem>
                                <hr className="xs-visible sm-visible hidden-md-up hidden-lg-up"/>
                                <NavItem className="margin-right-30">
                                    <Link href="#" className="nav-link" onClick={openEdit}>Edit Profile</Link>
                                </NavItem>
                                <hr className="xs-visible sm-visible hidden-md-up hidden-lg-up"/>
                                <NavItem>
                                    <Link href="#" className="nav-link" onClick={this.logOut}>Log Out</Link>
                                </NavItem>
                            </div>
                            : ""
                        }
                        {userLogged ? "" :
                            <div>
                                <NavItem className="margin-right-30">
                                    <Link href="#" className="nav-link" onClick={openRegister}>Sign Up</Link>
                                </NavItem>
                                <NavItem>
                                    <Link href="#" className="nav-link" onClick={openLogin}>Sign In</Link>
                                </NavItem>
                            </div>
                        }
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}
