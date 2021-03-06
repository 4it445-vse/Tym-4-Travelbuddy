import React, {Component} from "react";
import currentUser from "../../actions/CurrentUser";
import FontAwesome from "react-fontawesome";
import axios from "../../api";
import {connect} from "react-redux";
import {openLogin, openMeetUp, openContactBuddy} from "../../actions/modals";
import Loading from "../Images/Loading";
import moment from "moment";

class MeetUp extends Component {
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
                this.openMeetUp();
            }
        } else {
            this.props.openLogin();
        }
    }

    openMeetUp = () => {
        this.props.openMeetUp({buddy: this.state.buddy, meetUp: this.props.meetUp, isBuddyView: this.props.isBuddyView, refresh: this.props.refresh});
    }

    openContactBuddy = () => {
        this.props.openContactBuddy({buddy: this.state.buddy});
    }

    isHighlighted = () => {
        let currentUserGaveRating = false;
        this.props.meetUp.ratings.map(rating => {
            if (rating.buddy_id_from === this.props.user.id) {
                currentUserGaveRating = true;
            }
        });
        if (this.props.meetUp.done && this.props.meetUp.verified && !currentUserGaveRating) {
            return true;
        }
        if (!this.props.meetUp.done && this.props.meetUp.verified &&
            (new Date(this.props.meetUp.date_time).getTime() - new Date().getTime()) <= 0) {
            return true;
        }
        if (this.props.isBuddyView && !this.props.meetUp.verified) {
            return true;
        }
        return false;
    };

    render() {
        const {render} = this.state;
        const highlight = this.isHighlighted();
        if (render) return (
            <a href="#" onClick={this.onClick} className="profil_vypis">
                <div className="card-block" id="buddy-row">
                    <div className="col-md-1 col-xs-3 no-margin no-padding">
                        <img src={ this.state.avatarSrc }
                             alt={this.state.buddy.name + " " + this.state.buddy.surname}
                             className="profil_img rounded"/>
                    </div>
                    <div className="col-md-10 col-xs-5 m-t-05 no-padding">
                        <div className="col-xs-12 col-md-6 no-padding">
                            <p className={"no-margin ellipsis" + (highlight ? " highlight-text" : "")}>
                                {this.state.buddy.name + " " + this.state.buddy.surname}
                                </p>

                        </div>
                        <div className="col-xs-12 col-md-6 no-padding">

                            {highlight ? <span className="label label-success  margin-right-5">1</span>:""}
                            <span className="no-margin ellipsis">{this.state.buddy.city}</span>
                        </div>
                        <div className="col-xs-12 no-padding">
                            <span className="no-margin ellipsis">{
                                moment(this.props.meetUp.date_time).format(currentUser.dateFormat)
                            }</span>
                        </div>
                    </div>
                    <div className="col-md-1 col-xs-2 m-t-05">
                        <a href="#" onClick={this.onClick} className="profil_vypis" name="envelope">
                            <FontAwesome className="sexIcon" name="envelope" size="2x" id="envelope"
                                         style={{color: '#0275d8'}}></FontAwesome>
                        </a>
                    </div>
                </div>
            </a>
        );
        else return (<div className="card-block text-xs-center" id="buddy-row"><Loading/></div>)
    }
}
export default connect(
    (state) => ({
        user: state.user
    }),
    {
        openLogin,
        openMeetUp,
        openContactBuddy
    }
)(MeetUp);