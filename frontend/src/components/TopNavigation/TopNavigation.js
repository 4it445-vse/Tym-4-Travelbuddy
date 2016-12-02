import React, {Component} from "react";
import currentUser from "../../actions/CurrentUser";
import {Modal} from "react-bootstrap";
import LoginModal from "../Modals/LoginModal";
import RegisterModal from "../Modals/RegisterModal";
import ResetPassModal from "../Modals/ResetPassModal";
import EditProfileModal from "../Modals/EditProfileModal";
import NewRequestModal from "../Modals/NewRequestModal";
import EditRequestModal from "../Modals/EditRequestModal";
import Menu from "../Modals/Menu";
import {Alert} from 'react-bootstrap';

export default class TopNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoginModal: false,
            showRegisterModal: false,
            showEditModal: false,
            showNewRequestModal: false,
            showRestorePass: false,
            showEditRequestModal: false
        };

        this.closeLogin = this.closeLogin.bind(this);
        this.openLogin = this.openLogin.bind(this);
        this.closeRegister = this.closeRegister.bind(this);
        this.openRegister = this.openRegister.bind(this);
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.openNewRequest = this.openNewRequest.bind(this);
        this.closeNewRequest = this.closeNewRequest.bind(this);
        this.openEditRequests = this.openEditRequests.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.openRestorePass = this.openRestorePass.bind(this);
        this.closeRestorePass = this.closeRestorePass.bind(this);
        this.closeEditRequests = this.closeEditRequests.bind(this);
        this.closeQuestion = this.closeQuestion.bind(this);
        this.removeUser = this.removeUser.bind(this);
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

    closeAlert() {
        currentUser.setAlert(null);
        this.setState(this.state);
    }

    closeQuestion() {
        currentUser.setQuestion(null);
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

    openEdit() {
        this.closeRegister();
        this.setState({showEditModal: true});
    }

    closeEdit() {
        this.setState({showEditModal: false});
    }

    openNewRequest() {
        this.closeEditRequests();
        this.setState({showNewRequestModal: true});
    }

    closeNewRequest() {
        this.setState({showNewRequestModal: false});
    }

    openEditRequests() {
        this.setState({showEditRequestModal: true});
    }

    closeEditRequests() {
        this.setState({showEditRequestModal: false});
    }

    removeUser() {
        const question = currentUser.getQuestion();
        question.cb();
        this.closeQuestion();
    }

    render() {
        const loggedUser = currentUser.getCurrentUser();
        const userLogged = !!loggedUser;
        const alert = currentUser.getAlert();
        const question = currentUser.getQuestion();
        return (
            <div>
                <Menu openEdit={this.openEdit} openRegister={this.openRegister} openLogin={this.openLogin}
                      openNewRequest={this.openNewRequest} openEditRequests={this.openEditRequests}/>

                <LoginModal restorePassFn={this.openRestorePass} showProp={this.state.showLoginModal}
                            hideFn={this.closeLogin} switchFn={this.openRegister}/>

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
                {
                    (!!question) ?
                        <Modal show={true} onHide={this.closeQuestion}>
                            <Modal.Header closeButton>
                            </Modal.Header>
                            <Modal.Body>
                                {question.text}
                                <div>
                                    <button className="btn btn-defaul SearchButton text-white btn-margin-right-30"
                                            type="button"
                                            onClick={this.removeUser}>ANO
                                    </button>

                                    <button className="btn btn-defaul SearchButton text-white" type="button"
                                            onClick={this.closeQuestion}>NE
                                    </button>

                                </div>
                            </Modal.Body>
                        </Modal> : ""
                }
                { userLogged ?
                    <div>
                        <EditProfileModal showProp={this.state.showEditModal} hideFn={this.closeEdit}/>
                        <NewRequestModal showProp={this.state.showNewRequestModal} hideFn={this.closeNewRequest}/>
                        <EditRequestModal showProp={this.state.showEditRequestModal} hideFn={this.closeEditRequests}
                                          switchFn={this.openNewRequest}/>
                    </div>
                    : ""}

                <ResetPassModal showProp={this.state.showRestorePass} hideFn={this.closeRestorePass}/>
            </div>
        );
    }
}
