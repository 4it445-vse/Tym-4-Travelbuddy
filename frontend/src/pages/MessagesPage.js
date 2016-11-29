import React, {Component} from "react";
import MessageUsers from "../components/Messages/MessageUsers";
import MessageSearch from "../components/Messages/MessageSearch";
import currentUser from "../actions/CurrentUser";
import axios from "../api";


export default class MessagePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersWithMessages: [],
            usersWithMessagesChosen: [],
            currentBuddyInternal: undefined,
            selectedConversationUser: undefined,
            updateSelectedUserInUserViewFn: undefined
        };
        this.findUsers = this.findUsers.bind(this);
        this.setSelectedConversationUser = this.setSelectedConversationUser.bind(this);
        this.restrictUsers = this.restrictUsers.bind(this);
    }

    componentDidMount() {
        this.findUsers();
        this.restrictUsers("");
    }

    setSelectedConversationUser(value, fn) {
		restrictUsers(value);
        this.setState({
            selectedConversationUser: value,
            updateSelectedUserInUserViewFn: fn
        });
    }

    restrictUsers(value) {
        let usersWithMessagesChosen = [];
        if (value) {
            this.state.usersWithMessages.map(message => {
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
        let currentU = currentUser.getCurrentUser();
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
						let obj = {unreadIncomingMessagesNum: 0, lastMessageTime: message.date_time, id: message.buddy_id_from};
						if (cbm){
							obj.unreadIncomingMessagesNum = cbm.unreadIncomingMessagesNum;
							if((new Date(cbm.lastMessageTime) - new Date(message.date_time)) < 0){
								obj.lastMessageTime = message.date_time;
							}else{
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
						let obj = {unreadIncomingMessagesNum: 0, lastMessageTime: message.date_time, id: message.buddy_id_to};
						if (cbm){
							obj.unreadIncomingMessagesNum = cbm.unreadIncomingMessagesNum;
							if((new Date(cbm.lastMessageTime) - new Date(message.date_time)) < 0){
								obj.lastMessageTime = message.date_time;
							}else{
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
						this.state.usersWithMessages.push(obj);
						
						this.state.usersWithMessages.sort(function(a,b){
							return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
						});
						this.setState(this.state);
					});
				}
            }
        });
    }

    render() {
		console.log(this.state.usersWithMessagesChosen.length, this.state.usersWithMessagesChosen);
		console.log(this.state.usersWithMessages.length, this.state.usersWithMessages);
        return (
            <div className="row">
                <div className="v-o-5">
                    <div className="main_section">
                        <div className="container">
                            <div className="chat_container">
                                <div className="col-sm-3 chat_sidebar">
                                    <div className="row">
                                        <div className="dropdown-toggle">
                                            Všechny konverzace: <span className="caret float-right"></span>
                                        </div>
                                        <MessageSearch refreshUsersList={this.restrictUsers}/>
                                        <div className="member_list">
                                            <MessageUsers users={this.state.usersWithMessagesChosen} setSelectedConversationUser={this.setSelectedConversationUser}/>
                                        </div>
                                    </div>
                                </div>
                                {/*
                                 <div className="col-sm-9 message_section">
                                 <Messages selectedConversationUser={this.state.selectedConversationUser} updateSelectedUserInUserViewFn={this.state.updateSelectedUserInUserViewFn}/>
                                 </div>
                                 */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}