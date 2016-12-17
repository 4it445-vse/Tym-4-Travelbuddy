import React, {Component} from "react";
import MessageUsers from "./MessageUsers";
import MessageSearch from "./MessageSearch";
import currentUser from "../../actions/CurrentUser";
import axios from "../../api";


export default class MessagePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersWithMessages: [],
            usersWithMessagesChosen: []
        };
        this.findUsers = this.findUsers.bind(this);
        this.restrictUsers = this.restrictUsers.bind(this);
        this.refreshUsers = this.refreshUsers.bind(this);
    }

    componentDidMount() {
        this.props.setRefreshUsers(this.refreshUsers);
        this.refreshUsers();
    }

    refreshUsers() {
        this.findUsers();
        this.restrictUsers("");
    }

    restrictUsers(value) {
        let usersWithMessagesChosen = [];
        if (value) {
            console.log("In restrictUsers");
            this.state.usersWithMessages.map(message => {
                console.log(message.fullname, value, message.fullname.includes(value));
                if (message.fullname.includes(value)) {
                    usersWithMessagesChosen.push(message);
                }
            });
        } else {
            usersWithMessagesChosen = this.state.usersWithMessages;
        }
        this.setState({
            usersWithMessagesChosen: usersWithMessagesChosen
        });
    }

    findUsers() {
        this.state.usersWithMessages = [];
        let currentU = currentUser.getCurrentUser();
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
                    let unreadIncomingMessagesTotalNum = 0;
                    let currentUserId = currentU.id;
                    let lastMessageTime = undefined;
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
                                unreadIncomingMessagesTotalNum++;
                                obj.unreadIncomingMessagesNum = obj.unreadIncomingMessagesNum + 1;
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
                            let obj = messages.get(key);
                            obj.fullname = response.data[0].name + " " + response.data[0].surname;
                            obj.profile_photo_name = response.data[0].profile_photo_name;
                            this.state.usersWithMessages.push(obj);

                            this.state.usersWithMessages.sort(function (a, b) {
                                return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
                            });
                            if (this.props.selectedConversationUser && this.props.selectedConversationUser.id === obj.id) {
                                this.props.findUserMessages(value);
                            }
                            this.setState(this.state);
                        });
                    }
                }
            });
        });
    }

    render() {
        const {selectedConversationUser, setSelectedConversationUser} = this.props;
        return (
            <div className="row">
                <div className="dropdown-toggle1">
                    All conversations: <span className="caret float-right"></span>
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
