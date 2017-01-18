import React, {Component} from "react";
import MessagesUserPart from "../components/Messages/MessagesUserPart";
import Messages from "../components/Messages/Messages";
import { connect } from "react-redux";
import axios from "../api";


class MessagesPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedConversationUser: undefined,
            updateSelectedUserInUserViewFn: undefined
        };
        this.checkpoint = undefined;
        this.findUserMessages = undefined;
        this.refreshUsers = undefined;
    }

    componentDidMount() {
        //setInterval(this.setUpObserver, 5000);
    }

    setRefreshUsers = (fn) => {
        this.refreshUsers = fn;
    }

    setCheckPoint = (val) => {
        this.checkpoint = val;
    }

    incrementCheckPoint = () => {
        this.checkpoint++;
    }

    setUpObserver = () => {
        if(this.checkpoint){
            axios.get('messages/count', {
                params: {
                    filter: {
                        where: {
                            buddy_id_to: this.props.user.id
                        }
                    }
                }
            }).then(response => {
                if(response.data.count > this.checkpoint) {
                    this.refreshUsers();
                }
            });
        }
    }

    setFindUserMessages = (fn) => {
        this.findUserMessages = fn;
    }

    setSelectedConversationUser = (value, fn) => {
        if (this.findUserMessages) {
            this.findUserMessages(value);
        }
        this.setState({
            selectedConversationUser: value,
            updateSelectedUserInUserViewFn: fn
        });
    }

    render() {
        return (
            <div className="row">
                <div className="v-o-5">
                    <div className="main_section">
                        <div className="container">
                            <div className="chat_container">
                                <div className="col-sm-3 chat_sidebar">
                                    <MessagesUserPart selectedConversationUser={this.state.selectedConversationUser}
                                                      setSelectedConversationUser={this.setSelectedConversationUser}
                                                      findUserMessages={this.findUserMessages}
                                                      setRefreshUsers={this.setRefreshUsers}
                                                      setCheckPoint={this.setCheckPoint}/>
                                </div>
                                <div className="col-sm-9 message_section">
                                    <Messages setFindUserMessages={this.setFindUserMessages}
                                              selectedConversationUser={this.state.selectedConversationUser}
                                              updateSelectedUserInUserViewFn={this.state.updateSelectedUserInUserViewFn}
                                              incrementCheckPoint={this.incrementCheckPoint}
                                            refreshUsers={this.refreshUsers}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}

export default connect(
    (state) => ({
        user:state.user
    })
)(MessagesPage);