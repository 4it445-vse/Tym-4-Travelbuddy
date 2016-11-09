import React, { Component } from 'react';
import { Link } from 'react-router';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Modal } from 'react-bootstrap';
import axios from '../../api';
import currentUser from '../../actions/CurrentUser';

export class TopNavigation extends Component {

    render() {
		const {toggleNavbar, collapsed, openEdit, logOut, openRegister, openLogin} = this.props;
        const loggedUser = currentUser.getCurrentUser();
        const userLogged = !! loggedUser;
        
        return (
			<Navbar className="bg-primary" dark>
			  <NavbarBrand href="/">Travel Buddy</NavbarBrand>
			  <NavbarToggler className="float-sm-right float-lg-right hidden-lg-up collapsed" onClick={toggleNavbar} />
			  <Collapse className="navbar-toggleable-md" isOpen={!collapsed}>
				<Nav navbar className="float-lg-right">
				  {userLogged ? <NavItem className="nav-item">
					  <Link href="#" className="nav-link" onClick={openEdit}>Editovat profil</Link>
				  </NavItem>  : ""}
				  {userLogged ? <NavItem className="nav-item">
					  <Link href="#" className="nav-link" onClick={logOut}>Odhlaš se</Link>
				  </NavItem> : ""}
				  {userLogged ? "" : <NavItem className="nav-item">
					  <Link href="#" className="nav-link" onClick={openRegister}>Registrovat se</Link>
				  </NavItem>}
				  {userLogged ? "" : <NavItem className="nav-item">
					  <Link href="#" className="nav-link" onClick={openLogin}>Přihlásit se</Link>
				  </NavItem>}
				</Nav>
			  </Collapse>
			</Navbar>
        );
    }
}
