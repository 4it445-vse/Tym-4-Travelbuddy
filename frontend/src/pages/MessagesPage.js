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
            console.log("### Messages: ", buddyMessages);
            if (buddyMessages && buddyMessages[0]) {
                let unreadIncomingMessagesTotalNum = 0;
                let currentUserId = currentU.id;
                let lastMessageTime = undefined;
                buddyMessages.map(message => {
                    if (message.buddy_id_to === currentUserId) {
						console.log("### second 0/2 - map: ", messages);
                        let cbm = messages.get(message.buddy_id_from);
						let obj = {unreadIncomingMessagesNum: 0, lastMessageTime: message.date_time, id: message.buddy_id_from};
						if (cbm){
							console.log("### second 1/2 - map: ", messages);
							console.log("### second - "+message.buddy_id_from+", "+cbm.id+", "+cbm.lastMessageTime);
							obj.unreadIncomingMessagesNum = cbm.unreadIncomingMessagesNum;
							console.log(cbm.lastMessageTime, message.date_time);
							console.log(new Date(cbm.lastMessageTime), new Date(message.date_time));
							console.log("(new Date(cbm.lastMessageTime) - new Date(message.date_time)) < 0: ", (new Date(cbm.lastMessageTime) - new Date(message.date_time)) < 0);
							if((new Date(cbm.lastMessageTime) - new Date(message.date_time)) < 0){
								obj.lastMessageTime = message.date_time;
							}else{
								obj.lastMessageTime = cbm.lastMessageTime;
							}
						}
						console.log("### first 3/4- "+obj.lastMessageTime);
                        if (message.displayed === false) {
                            unreadIncomingMessagesTotalNum++;
                            obj.unreadIncomingMessagesNum = obj.unreadIncomingMessagesNum + 1;
                        }
						console.log("### first 4/4- "+obj.lastMessageTime);
						messages.set(message.buddy_id_from, obj);
						console.log("### second 5/4 - map: ", messages);
                    } else {
						console.log("send");
						console.log(messages, message.buddy_id_to);
						let cbm = messages.get(message.buddy_id_to);
						let obj = {unreadIncomingMessagesNum: 0, lastMessageTime: message.date_time, id: message.buddy_id_to};
						if (cbm){
							obj.unreadIncomingMessagesNum = cbm.unreadIncomingMessagesNum;
							console.log("Again: ",cbm.lastMessageTime);
							console.log(new Date(cbm.lastMessageTime), new Date(message.date_time));
							console.log((new Date(cbm.lastMessageTime) - new Date(message.date_time)) < 0);
							if((new Date(cbm.lastMessageTime) - new Date(message.date_time)) < 0){
								obj.lastMessageTime = message.date_time;
							}else{
								obj.lastMessageTime = cbm.lastMessageTime;
							}
						}
						console.log("round");
						messages.set(message.buddy_id_to, obj);
                    }
                });
                console.log("map: ", messages);
                for (let [key, value] of messages) {
					console.log("In loop: "+key, value);
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
					});
				}
                console.log("enriched array: ", this.state.usersWithMessages);
				this.state.usersWithMessages.map(value =>{
					console.log("value in map: ", value);
				});
				this.state.usersWithMessages = this.state.usersWithMessages.sort(function(a,b){
					return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
				});
                console.log("sorted array: ", this.state.usersWithMessages);
				this.state.usersWithMessages.map(value =>{
					console.log("value in map: ", value);
				});
				for(let val of this.state.usersWithMessages){
					console.log("value in map: ", val);
				}
				this.setState(this.state);
            }
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
                                    <div className="row">
                                        <div className="dropdown-toggle">
                                            Všechny konverzace: <span className="caret float-right"></span>
                                        </div>
                                        <MessageSearch refreshUsersList={this.restrictUsers}/>
                                        <div className="member_list">
                                            <MessageUsers users={this.state.usersWithMessagesChosen} withMessages={true}
                                                          setSelectedConversationUser={this.setSelectedConversationUser}/>
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