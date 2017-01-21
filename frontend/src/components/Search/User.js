import React, {Component} from "react";
import currentUser from "../../actions/CurrentUser";
import FontAwesome from "react-fontawesome";
import axios from "../../api";
import {connect} from "react-redux";
import {openLogin, openProfile, openContactBuddy} from "../../actions/modals";
import Loading from "../Images/Loading";

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buddy: {
                about_me: null,
                name: null,
                surname: null,
                sex: null,
                city: null
            },
            render: false,
            avatarSrc: "http://images.megaupload.cz/mystery-man.png"
        }
    }

    componentDidMount() {
        axios.get('buddies/' + this.props.buddyId).then(response => {
            const buddy = response.data;
            currentUser.composeProfilePhotoName(buddy, (avatarSrcResult) => {
                this.setState({
                    buddy: buddy,
                    render: true,
                    avatarSrc: avatarSrcResult
                });
            });
        });
    }

    onClick = (e) => {
        if (this.props.user) {
            if (e.target.id === 'envelope') {
                this.openContactBuddy();
            } else {
                this.openProfile();
            }
        } else {
            this.props.openLogin();
        }
    }

    openProfile = () => {
        this.props.openProfile({buddy: this.state.buddy, flag:true});
    }

    openContactBuddy = () => {
        this.props.openContactBuddy({buddy: this.state.buddy});
    }

    render() {

        const {render} = this.state;

        if (render) return (
            <a href="#" onClick={this.onClick} className="profil_vypis">
                <div className="card-block" id="buddy-row">
                    <div className="col-md-1 col-xs-3 no-margin no-padding">
                        <img src={ this.state.avatarSrc }
                             alt={this.state.buddy.name + " " + this.state.buddy.surname}
                             className="profil_img rounded"/>
                    </div>
                    <div className="col-md-3 col-xs-5 m-t-05">
                        <div className="row">
                            <p className="no-margin ellipsis">{this.state.buddy.name + " " + this.state.buddy.surname}</p>
                        </div>
                        <div className="row">
                            <span className="no-margin ellipsis">{this.state.buddy.city}</span>
                        </div>
                    </div>
                    <div className="col-md-1 col-xs-2 m-t-05">
                        {
                            this.state.buddy.sex === 'male' ?
                                <FontAwesome className="sexIcon" name="male" size="2x"
                                             style={{color: '#0275d8'}}></FontAwesome> :
                                <FontAwesome className="sexIcon" name="female" size="2x"
                                             style={{color: 'red'}}></FontAwesome>
                        }
                    </div>
                    <div className="col-md-6 hidden-sm-down m-t-05">
                        <p className="no-margin ellipsis2">{this.state.buddy.about_me}</p>
                    </div>
                    <div className="col-md-1 col-xs-2 m-t-05">

                            <FontAwesome onClick={this.onClick} className="sexIcon" name="envelope" size="2x" id="envelope"
                                         style={{color: '#0275d8'}}></FontAwesome>

                    </div>
                </div>
            </a>
        )
        else return (<div className="card-block text-xs-center" id="buddy-row"><Loading/></div>)
    }
}
export default connect(
    (state) => ({
        user : state.user
    }),
    {
        openLogin,
        openProfile,
        openContactBuddy
    }
)(User);