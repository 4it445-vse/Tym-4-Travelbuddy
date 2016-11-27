import React, {Component} from "react";
import currentUser from "../../actions/CurrentUser";
import LoginModal from "../Modals/LoginModal";
import RegisterModal from "../Modals/RegisterModal";
import EditProfileModal from "../Modals/EditProfileModal";
import NewRequestModal from "../Modals/NewRequestModal";
import EditRequestModal from "../Modals/EditRequestModal";
import Menu from "../Modals/Menu";

export default class TopNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoginModal: false,
            showRegisterModal: false,
            showEditModal: false,
            showNewRequestModal: false,
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
        this.closeEditRequests = this.closeEditRequests.bind(this);
    }

    componentDidMount() {
        currentUser.setOpenLogInFn(this.openLogin);
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

    render() {
        const loggedUser = currentUser.getCurrentUser();
        const userLogged = !!loggedUser;
        return (
            <div>
                <Menu openEdit={this.openEdit} openRegister={this.openRegister} openLogin={this.openLogin} openNewRequest={this.openNewRequest} openEditRequests={this.openEditRequests}/>

                <LoginModal showProp={this.state.showLoginModal} hideFn={this.closeLogin} switchFn={this.openRegister}/>

                <RegisterModal showProp={this.state.showRegisterModal} hideFn={this.closeRegister}
                               switchFn={this.openLogin}/>

                { userLogged ?
                  <div>
                    <EditProfileModal showProp={this.state.showEditModal} hideFn={this.closeEdit}/>
                    <NewRequestModal showProp={this.state.showNewRequestModal} hideFn={this.closeNewRequest}/>
                    <EditRequestModal showProp={this.state.showEditRequestModal} hideFn={this.closeEditRequests} switchFn={this.openNewRequest}/>
                  </div>
                    : ""}
            </div>
        );
    }
}
