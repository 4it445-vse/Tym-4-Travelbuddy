import React, {Component} from "react";
import currentUser from "../../actions/CurrentUser";
import {Modal} from "react-bootstrap";
import EditProfileModal from "../Modals/EditProfileModal";
import RegisterModal from "../Modals/RegisterModal";
import LoginModal from "../Modals/LoginModal";
import Menu from "../Modals/Menu";
import {Alert} from 'react-bootstrap';

export default class TopNavigation extends Component {
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
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
    }

    componentDidMount() {
        currentUser.setOpenLogInFn(this.openLogin);
    }

    openEdit() {
        this.setState({showEditModal: true});
    }

    closeAlert() {
        currentUser.setAlert(null);
        this.setState(this.state);
    }

    closeEdit() {
        this.setState({showEditModal: false});
    }

    openLogin() {
        this.setState({showRegisterModal: false, showLoginModal: true});
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
        const userLogged = !!loggedUser;
        const alert = currentUser.getAlert();
        console.log("###", !!alert);
        return (
            <div>
                <Menu openEdit={this.openEdit} openRegister={this.openRegister} openLogin={this.openLogin}/>

                <LoginModal showProp={this.state.showLoginModal} hideFn={this.closeLogin} switchFn={this.openRegister}/>

                <RegisterModal showProp={this.state.showRegisterModal} hideFn={this.closeRegister}
                               switchFn={this.openLogin}/>
                {
                    (!!alert) ?
                        <Modal show={true} onHide={this.closeAlert}>
                            <Modal.Header closeButton>
                            </Modal.Header>
                            <Modal.Body>
                                <Alert bsStyle={alert.type}>
                                    {alert.message}
                                </Alert>
                            </Modal.Body>
                        </Modal> : ""
                }
                { userLogged ?
                    <EditProfileModal showProp={this.state.showEditModal} hideFn={this.closeEdit}/>
                    : ""}
            </div>
        );
    }
}
