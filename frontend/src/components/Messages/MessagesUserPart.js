import React, {Component} from "react";
import MessageUsers from "./MessageUsers";
import MessageSearch from "./MessageSearch";
import {connect} from "react-redux";
import axios from "../../api";
import currentUser from "../../actions/CurrentUser";

class MessagesUserPart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersWithMessages: [],
            usersWithMessagesChosen: []
        };
    }

    componentDidMount() {
        this.props.setRefreshUsers(this.refreshUsers);
        this.refreshUsers();
    }

    componentDidUpdate() {
        if(this.props.messages.time !== this.time){
            this.time = this.props.messages.time;
            this.props.setRefreshUsers(this.refreshUsers);
            this.refreshUsers();
        }
    }

    refreshUsers = () => {
        this.findUsersAndMessages();
        this.restrictUsers("");
    };

    restrictUsers = (value) => {
        let usersWithMessagesChosen = [];
        if (value) {
            this.state.usersWithMessages.map(message => {
                if (message.fullname.toUpperCase().includes(value.toUpperCase())) {
                    usersWithMessagesChosen.push(message);
                }
            });
        } else {
            usersWithMessagesChosen = this.state.usersWithMessages;
        }
        this.setState({
            usersWithMessagesChosen: usersWithMessagesChosen
        });
    };

    findUsersAndMessages = () => {
        this.state.usersWithMessages = [];
        this.setIncomingMessageCountCheckpoint(this.props.user.id, (currentUserId) => {
            axios.get('messages', {
                params: {
                    filter: {
                        where: {
                            or: [
                                {"buddy_id_to": currentUserId},
                                {"buddy_id_from": currentUserId}
                            ]
                        }
                    }
                }
            }).then(response => {
                let allMessagesAssociatedToCurrentUser = response.data;
                if (allMessagesAssociatedToCurrentUser && allMessagesAssociatedToCurrentUser[0]) {
                    let messages = new Map();
                    this.fillMapByMessagesSortedByUsers(allMessagesAssociatedToCurrentUser, currentUserId, messages);
                    this.queryBuddiesAndFillUserMessagesAndRefresh(messages);
                }
            });
        });
    };

    setIncomingMessageCountCheckpoint = (currentUserId, cb) => {
        axios.get('messages/count', {
            params: {
                filter: {
                    where: {
                        buddy_id_to: currentUserId
                    }
                }
            }
        }).then(response => {
            this.props.setCheckPoint(response.data.count);
            cb(currentUserId);
        });
    };

    fillMapByMessagesSortedByUsers = (allMessagesAssociatedToCurrentUser, currentUserId, messages) => {
        allMessagesAssociatedToCurrentUser.map(message => {
            if (message.buddy_id_to === currentUserId) {
                this.addIncomingMessage(messages, message);
            } else {
                this.addOutgoingMessage(messages, message);
            }
        });
    };

    addOutgoingMessage = (messages, message) => {
        this.addMessage(messages, message, message.buddy_id_to, false);
    };

    addIncomingMessage = (messages, message) => {
        this.addMessage(messages, message, message.buddy_id_from, true);
    };

    addMessage = (messages, message, buddyId, isIncoming) => {
        let userMessageDetails = messages.get(buddyId);
        if (userMessageDetails) {
            if ((new Date(userMessageDetails.lastMessageTime) - new Date(message.date_time)) < 0) {
                userMessageDetails.lastMessageTime = message.date_time;
            }
        } else {
            userMessageDetails = {
                unreadIncomingMessagesNum: 0,
                lastMessageTime: message.date_time,
                id: buddyId
            };
        }
        if (isIncoming && message.displayed === false) {
            userMessageDetails.unreadIncomingMessagesNum++;
        }
        messages.set(buddyId, userMessageDetails);
    };

    queryBuddiesAndFillUserMessagesAndRefresh = (messages) => {
        for (let [key, value] of messages) {
            axios.get('buddies', {
                params: {
                    filter: {
                        where: {
                            id: key
                        }
                    }
                }
            }).then(response => {
                this.fillUserMessagesAndRefresh(response, messages, key, value);
            });
        }
    };

    fillUserMessagesAndRefresh = (response, messages, key, value) => {
        let buddy = response.data[0];
        currentUser.composeProfilePhotoName(buddy, (avatarSrcResult) => {
            let userMessageObj = this.createUserMessage(messages, key, response, avatarSrcResult);
            this.state.usersWithMessages.push(userMessageObj);

            this.state.usersWithMessages.sort(function (a, b) {
                return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
            });
            if (this.props.selectedConversationUser && this.props.selectedConversationUser.id === userMessageObj.id) {
                this.props.findUserMessages(value);
            }
            this.setState(this.state);
        });
    };

    createUserMessage = (messages, key, response, avatarSrcResult) => {
        let obj = messages.get(key);
        obj.fullname = response.data[0].name + " " + response.data[0].surname;
        obj.profile_photo_name = response.data[0].profile_photo_name;
        obj.avatarSrc = avatarSrcResult;
        return obj;
    };

    render() {
        const {selectedConversationUser, setSelectedConversationUser} = this.props;
        return (
            <div className="row">
                <div className="dropdown-toggle1">
                    All conversations: <span className="caret float-right"/>
                </div>
                <MessageSearch refreshUsersList={this.restrictUsers}/>
                <div className="member_list"
                     id={!!selectedConversationUser ? "" : "member_list_noone_selected"}>
                    <MessageUsers users={this.state.usersWithMessagesChosen}
                                  setSelectedConversationUser={setSelectedConversationUser}
                                  selectedConversationUser={selectedConversationUser}/>
                </div>
            </div>
        );
    }


}
export default connect(
    (state) => ({
        user: state.user,
        messages: state.messages
    })
)(MessagesUserPart)