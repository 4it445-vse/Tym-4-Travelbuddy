import React, {Component} from "react";
import {Link} from "react-router";
import {Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavDropdown, DropdownToggle, DropdownMenu, DropdownItem} from "reactstrap";
import axios from "../../api";
import {connect} from "react-redux";
import {logOutUser} from "../../actions/user";
import {refreshMessages} from "../../actions/messages";
import currentUser from "../../actions/CurrentUser";
class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            collapsedMyTravelling: true
        };

        currentUser.setRefreshMessagesFn(this.refreshMessages);
    }

    setCollapsedMyTravelling = () => {
        this.setState({collapsedMyTravelling: (this.state.collapsedMyTravelling === false)});
    };

    logOut = () => {
        this.props.logOutUser();
    };

    refreshMessages = (data) => {
        this.props.refreshMessages(data);
    }

    toggleNavbar = () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    };

    toggleDropdown() {
        this.setState({
            collapsedMyTravelling: !this.state.collapsedMyTravelling
        });
    }

    countMeetUpAndRatingAllerts = () => {
        console.log(this.props.messages);
        axios.get('Meetups', {
            params: {
                filter: {
                    include: 'ratings',
                    where: {
                        or: [
                            {"buddy_id_to": this.props.user.id},
                            {"buddy_id_from": this.props.user.id}
                        ]
                    }
                }
            }
        }).then(response => {
            let meetUps = response.data;
            let meetAndRatingsAlertsNum = 0;
            meetUps.map(meetUp => {
                let currentUserGaveRating = false;
                meetUp.ratings.map(rating => {
                    if (rating.buddy_id_from === this.props.user.id) {
                        currentUserGaveRating = true;
                    }
                });
                if (meetUp.verified && meetUp.done && !currentUserGaveRating) {
                    meetAndRatingsAlertsNum++;
                } else if (meetUp.buddy_id_to === this.props.user.id && !meetUp.verified) {
                    meetAndRatingsAlertsNum++;
                } else if (meetUp.verified && !meetUp.done &&
                    (new Date(meetUp.date_time).getTime() - new Date().getTime()) <= 0) {
                    meetAndRatingsAlertsNum++;
                }
            });
            if (this.state.meetAndRatingsAlertsNum !== meetAndRatingsAlertsNum) {
                this.setState({
                    meetAndRatingsAlertsNum: meetAndRatingsAlertsNum
                });
            }
        });
    };

    countIncomingUnreadMessages = () => {
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
                if (message.displayed === false) {
                    incomingUnreadMessagesNum++;
                }
            });
            if (this.state.incomingUnreadMessagesNum !== incomingUnreadMessagesNum) {
                this.setState({
                    incomingUnreadMessagesNum: incomingUnreadMessagesNum
                });
            }
        });
    };

    render() {
        const {openEdit, openRegister, openLogin, openNewRequest, openEditRequests} = this.props;
        const loggedUser = this.props.user;
        const userLogged = !!loggedUser;
        if (userLogged) {//TODO move to some other callback method, do one counting resful method on backend even for done
            this.countIncomingUnreadMessages();
            this.countMeetUpAndRatingAllerts();
        }

        return (
            <Navbar className="navbar-fixed-top bg-primary row" dark>
                <div className="col-xs-9 col-md-3 text-xs-left">

                    <NavbarBrand href="/"><img src="http://images.megaupload.cz/Bez_nazvu-5ey4Z7.png" alt="logo" width="15%"/> Travel Buddy</NavbarBrand>
                </div>
                <div className="col-xs-3 col-md-9 text-xs-right">
                    <NavbarToggler className="hidden-lg-up collapsed pointer" onClick={this.toggleNavbar}/>
                </div>
                <Collapse className="navbar-toggleable-md" isOpen={!this.state.collapsed}>
                    <Nav navbar className="float-lg-right text-xs-center">
                        {userLogged ?
                            <div>
                                <NavItem className="margin-right-30">
                                    <Link href="/meetups-and-ratings" className="nav-link" role="tab" data-toggle="tab">Meet Ups {this.state.meetAndRatingsAlertsNum > 0 ?
                                        <span className="label label-success"> {this.state.meetAndRatingsAlertsNum}</span>
                                        : ""}
                                    </Link>
                                </NavItem>
                                <hr className="hidden-lg-up"/>
                                <NavItem className="margin-right-30">
                                    <Link href="/messages" className="nav-link" role="tab" data-toggle="tab">Messages {this.state.incomingUnreadMessagesNum > 0 ?
                                        <span className="label label-success"> {this.state.incomingUnreadMessagesNum}</span>
                                        : ""}
                                    </Link>
                                </NavItem>
                                <hr className="hidden-lg-up"/>
                                <NavItem className="margin-right-30">
                                    <Link href="/" className="nav-link">Buddies</Link>
                                </NavItem>
                                <hr className="hidden-lg-up"/>
                                <NavItem className="margin-right-30">
                                    <Link href="/requests" className="nav-link">Requests</Link>
                                </NavItem>
                                <hr className="hidden-lg-up"/>
                                <NavDropdown className="margin-right-30" isOpen={!this.state.collapsedMyTravelling} toggle={this.setCollapsedMyTravelling}>
                                    <DropdownToggle className="dropdown-toggle nav-link">
                                        My Traveling
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem><a onClick={openNewRequest}>Create New Request</a></DropdownItem>
                                        <DropdownItem><a onClick={openEditRequests}>Edit My Requests</a></DropdownItem>
                                    </DropdownMenu>
                                </NavDropdown>
                                <hr className="hidden-lg-up"/>
                                <NavItem className="margin-right-30">
                                    <Link href="#" className="nav-link" onClick={openEdit}>Edit Profile</Link>
                                </NavItem>
                                <hr className="hidden-lg-up"/>
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
        user: state.user,
        messages: state.messages
    }),
    {
        logOutUser,
        refreshMessages
    }
)(Menu);
