import React, {Component} from "react";
import currentUser from "../../actions/CurrentUser";
import {Modal} from "react-bootstrap";
import EditProfileModal from "../Modals/EditProfileModal";
import RegisterModal from "../Modals/RegisterModal";
import LoginModal from "../Modals/LoginModal";
import ResetPassModal from "../Modals/ResetPassModal";
import Menu from "../Modals/Menu";
import {Alert} from 'react-bootstrap';

export default class TopNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoginModal: false,
            showRegisterModal: false,
            showEditModal: false,
            showRestorePass: false
        };

        this.closeLogin = this.closeLogin.bind(this);
        this.openLogin = this.openLogin.bind(this);
        this.closeRegister = this.closeRegister.bind(this);
        this.openRegister = this.openRegister.bind(this);
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.openRestorePass = this.openRestorePass.bind(this);
        this.closeRestorePass = this.closeRestorePass.bind(this);
    }

    componentDidMount() {
        currentUser.setOpenLogInFn(this.openLogin);
    }

    openRestorePass() {
        this.setState({showRestorePass: true, showLoginModal: false});
    }

    closeRestorePass() {
        this.setState({showRestorePass: false});
    }

    openEdit() {
        this.setState({showEditModal: true});
    }

    closeEdit() {
        this.setState({showEditModal: false});
    }

    closeAlert() {
        currentUser.setAlert(null);
        this.setState(this.state);
    }

    openLogin() {
        this.setState({showRegisterModal: false, showLoginModal: true});
    }

    closeLogin() {
        this.setState({showLoginModal: false});
    }

    openRegister() {
        this.setState({showRegisterModal: true, showLoginModal: false});
    }

    closeRegister() {
        this.setState({showRegisterModal: false});
    }

    render() {
        const loggedUser = currentUser.getCurrentUser();
        const userLogged = !!loggedUser;
        const alert = currentUser.getAlert();
        return (
            <div>
                <Menu openEdit={this.openEdit} openRegister={this.openRegister} openLogin={this.openLogin}/>

                <LoginModal restorePassFn={this.openRestorePass} showProp={this.state.showLoginModal} hideFn={this.closeLogin} switchFn={this.openRegister}/>

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

                <ResetPassModal showProp={this.state.showRestorePass} hideFn={this.closeRestorePass} />
            </div>
        );
    }
}
