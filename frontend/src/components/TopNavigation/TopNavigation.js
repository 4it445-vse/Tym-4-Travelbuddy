import React, { Component } from 'react';
import { Link } from 'react-router';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Modal } from 'react-bootstrap';
import axios from '../../api';
import currentUser from '../../actions/CurrentUser';
import EditProfileModal from '../Modals/EditProfileModal';
import RegisterModal from '../Modals/RegisterModal';
import RegisterModal from '../Modals/LoginModal';
import Menu from '../Modals/Menu';

export class TopNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoginModal: false,
            showRegisterModal: false,
            showEditModal: false
        };
		
        this.closeLogin = this.closeLogin.bind(this);
        this.openLogin = this.openLogin.bind(this);
        this.closeRegister = this.closeRegister.bind(this);
        this.openRegister = this.openRegister.bind(this);
        this.logOut = this.logOut.bind(this);
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
    }

    logOut() {
        console.log("logout success");
        currentUser.setCurrentUser(undefined);
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

    render() {
        const loggedUser = currentUser.getCurrentUser();
        const userLogged = !! loggedUser;
        console.log("called render");
        return (
            <div>
				<Menu openEdit={this.openEdit} logOut={this.logOut} openRegister={this.openRegister} openLogin={this.openLogin}/>
				
				<LoginModal showProp={this.state.showLoginModal} hideFn={this.closeLogin} switchFn={this.openRegister}/>

                <RegisterModal showProp={this.state.showRegisterModal} hideFn={this.closeRegister} switchFn={this.openLogin}/>

                { userLogged ?
                    <EditProfileModal showProp={this.state.showEditModal} hideFn={this.closeEdit}/>
                : ""}
            </div>
        );
    }
}
