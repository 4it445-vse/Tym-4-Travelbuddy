import React, {Component} from "react";
import {Link} from "react-router";
import {Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem} from "reactstrap";
import axios from "../../api"
import { connect } from "react-redux";
import { logOutUser } from "../../actions/user";
class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            collapsedMyTravelling: true
        };

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.logOut = this.logOut.bind(this);
        this.countIncomingUnreadMessages = this.countIncomingUnreadMessages.bind(this);
        this.countMeetUpAndRatingAllerts = this.countMeetUpAndRatingAllerts.bind(this);
        this.setCollapsedMyTravelling = this.setCollapsedMyTravelling.bind(this);
    }

    setCollapsedMyTravelling() {
        this.setState({collapsedMyTravelling: (this.state.collapsedMyTravelling === false)});
    }

    logOut() {
        this.props.logOutUser();
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    countMeetUpAndRatingAllerts() {
        axios.get('meetup', {
            params: {
                filter: {
                    where: {
                        "buddy_id_to": this.props.user.id,
                        "verified": null
                    }
                }
            }
        }).then(response => {
            let meetUpAlerts = response.data;
            let meetAndRatingsAlertsNum = 0;
            meetUpAlerts.map(message => {
                if(message.displayed === false){
                    meetAndRatingsAlertsNum++;
                }
            });
            axios.get('buddyRating', {
                params: {
                    filter: {
                        where: {
                            "buddy_id_from": this.props.user.id,
                            "rating": null
                        }
                    }
                }
            }).then(response => {
                let ratingAlerts = response.data;
                ratingAlerts.map(message => {
                    if(message.displayed === false){
                        meetAndRatingsAlertsNum++;
                    }
                });
                if(this.state.meetAndRatingsAlertsNum !== meetAndRatingsAlertsNum){
                    this.setState({
                        meetAndRatingsAlertsNum: meetAndRatingsAlertsNum
                    });
                }
            });
        });
    }

	countIncomingUnreadMessages() {
		axios.get('messages', {
		params: {
			filter: {
				where: {
					"buddy_id_to": this.props.user.id
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
            if(this.state.incomingUnreadMessagesNum !== incomingUnreadMessagesNum){
                this.setState({
                    incomingUnreadMessagesNum: incomingUnreadMessagesNum
                });
            }
		});
	}

    render() {
        const {openEdit, openRegister, openLogin, openNewRequest, openEditRequests} = this.props;
        const loggedUser = this.props.user;
        const userLogged = !!loggedUser;
		if(userLogged){//TODO move to some other callback method, do one counting resful method on backend even for done
			this.countIncomingUnreadMessages();
			this.countMeetUpAndRatingAllerts();
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
                                    <Link href="/meetups-and-ratings" className="nav-link" role="tab" data-toggle="tab">Meet Ups {this.state.meetAndRatingsAlertsNum > 0 ?<span className="label label-success"> {this.state.meetAndRatingsAlertsNum}</span>
                                        : ""}
                                    </Link>
                                </NavItem>
                                <NavItem className="margin-right-30">
                                    <Link href="/messages" className="nav-link" role="tab" data-toggle="tab">Messages {this.state.incomingUnreadMessagesNum > 0 ?<span className="label label-success"> {this.state.incomingUnreadMessagesNum}</span>
								    : ""}
							        </Link>
                                </NavItem>
						        <hr className="xs-visible sm-visible hidden-md-up hidden-lg-up"/>
                                <NavItem className="margin-right-30">
                                    <Link href="/" className="nav-link">Buddies</Link>
                                </NavItem>
                                <hr className="xs-visible sm-visible hidden-md-up hidden-lg-up"/>
                                <NavItem className="margin-right-30">
                                    <Link href="/requests" className="nav-link">Requests</Link>
                                </NavItem>
                                <hr className="xs-visible sm-visible hidden-md-up hidden-lg-up"/>
                                <NavItem className="margin-right-30">
                                    <li className={this.state.collapsedMyTravelling ? "nav-item dropdown" : "nav-item dropdown open"}>
                                        <a className="nav-link dropdown-toggle"
                                           href="#" id="supportedContentDropdown"
                                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                           onClick={this.setCollapsedMyTravelling}
                                           >My traveling</a>
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
                                <NavItem className="margin-right-30">
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

export default connect(
    (state) => ({
        user: state.user
    }),
    {
        logOutUser
    }
)(Menu);
