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

    refreshUsers = () => {
        this.findUsers();
        this.restrictUsers("");
    };

    restrictUsers = (value) => {
        let usersWithMessagesChosen = [];
        if (value) {
            this.state.usersWithMessages.map(message => {
                console.log(message.fullname, value, message.fullname.includes(value));
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

    findUsers = () => {
        this.state.usersWithMessages = [];
        let currentU = this.props.user;
        this.setIncomingMessageCountCheckpoint(currentU, (currentU) => {
            axios.get('messages', {
                params: {
                    filter: {
                        where: {
                            or: [
                                {"buddy_id_to": currentU.id},
                                {"buddy_id_from": currentU.id}
                            ]
                        }
                    }
                }
            }).then(response => {
                let buddyMessages = response.data;
                let messages = new Map();
                if (buddyMessages && buddyMessages[0]) {
                    let currentUserId = currentU.id;
                    this.fillMapByMessagesSortedByUsers(buddyMessages, currentUserId, messages);
                    this.queryBuddiesAndFillUserMessagesAndRefresh(messages);
                }
            });
        });
    };

    setIncomingMessageCountCheckpoint = (currentU, cb) => {
        axios.get('messages/count', {
            params: {
                filter: {
                    where: {
                        buddy_id_to: currentU.id
                    }
                }
            }
        }).then(response => {
            this.props.setCheckPoint(response.data.count);
            cb(currentU);
        });
    };

    fillMapByMessagesSortedByUsers = (buddyMessages, currentUserId, messages) => {
        buddyMessages.map(message => {
            if (message.buddy_id_to === currentUserId) {
                let cbm = messages.get(message.buddy_id_from);
                let obj = {
                    unreadIncomingMessagesNum: 0,
                    lastMessageTime: message.date_time,
                    id: message.buddy_id_from
                };
                if (cbm) {
                    obj.unreadIncomingMessagesNum = cbm.unreadIncomingMessagesNum;
                    if ((new Date(cbm.lastMessageTime) - new Date(message.date_time)) < 0) {
                        obj.lastMessageTime = message.date_time;
                    } else {
                        obj.lastMessageTime = cbm.lastMessageTime;
                    }
                }
                if (message.displayed === false) {
                    obj.unreadIncomingMessagesNum++;
                }
                messages.set(message.buddy_id_from, obj);
            } else {
                let cbm = messages.get(message.buddy_id_to);
                let obj = {
                    unreadIncomingMessagesNum: 0,
                    lastMessageTime: message.date_time,
                    id: message.buddy_id_to
                };
                if (cbm) {
                    obj.unreadIncomingMessagesNum = cbm.unreadIncomingMessagesNum;
                    if ((new Date(cbm.lastMessageTime) - new Date(message.date_time)) < 0) {
                        obj.lastMessageTime = message.date_time;
                    } else {
                        obj.lastMessageTime = cbm.lastMessageTime;
                    }
                }
                messages.set(message.buddy_id_to, obj);
            }
        });
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
        user: state
    })
)(MessagesUserPart)