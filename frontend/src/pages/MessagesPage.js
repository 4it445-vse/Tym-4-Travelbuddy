import React, {Component} from "react";
import MessageUsers from "../components/Messages/MessageUsers";
import MessageSearch from "../components/Messages/MessageSearch";
import Messages from "../components/Messages/Messages";
import currentUser from "../actions/CurrentUser";
import axios from "../api"


export default class MessagePage extends Component {
	
	constructor(props){
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
	
	setSelectedConversationUser(value, fn){
		this.setState({
			selectedConversationUser: value,
			updateSelectedUserInUserViewFn: fn
		});
	}
	
	restrictUsers(value){
		let usersWithMessagesChosen = [];
		if(value){
			this.state.usersWithMessages.map(message =>{
				if(message.name.includes(value) || message.surname.includes(value)){
					usersWithMessagesChosen.push(message);
				}
			});
		}else{
			usersWithMessagesChosen = this.state.usersWithMessages;
		}
		this.setState({
			usersWithMessagesChosen: usersWithMessagesChosen
		});
	}
	
	findUsers(){
		let buddy = currentUser.getCurrentUser();
		axios.get('messages', {
		params: {
			filter: {
				where: {
					or: [
						{"buddy_id_to": buddy.id},
						{"buddy_id_from": buddy.id}
					]
				}
			}
		}
		}).then(response => {
			console.log("### Messages: ", response.data);
			
		});
		
		
		/*
		console.log('In MessgePage.findUsers about to querry all verified users.');
		axios.get('buddies', {
        params: {
            filter: {
                where: {
                    emailVerified: 1
                }
            }
        }
		}).then(response => {
			console.log("All verified buddies:", response.data);
			response.data.map(buddy =>
			{
				console.log("About to count messages for buddy with id: ", buddy.id);
				this.state.currentBuddyInternal = buddy;
				axios.get('messages', {
				params: {
					filter: {
						where: {
							or: [
								{"buddy_id_to": buddy.id},
								{"buddy_id_from": buddy.id}
							]
						}
					}
				}
				}).then(response => {
					let buddyMessages = response.data;
					if(buddyMessages && buddyMessages[0]){
						console.log("Buddy with id: "+buddyMessages[0].buddy_id_to+" has "+buddyMessages.size+" messages.");
						let unreadIncomingMessagesNum = 0;
						let messagesWithCurrentUserNum = 0;
						let currentUserId = currentUser.getCurrentUser().id;
						let lastMessageTime = undefined;
						buddyMessages.map(message =>{
							if(message.buddy_id_to === currentUserId || message.buddy_id_from === currentUserId){
								messagesWithCurrentUserNum++;
								if(lastMessageTime === undefined){
									lastMessageTime = message.date_time;
								} else if(lastMessageTime && lastMessageTime < message.date_time){
									lastMessageTime = message.date_time;
								}
							}
							if(message.buddy_id_to === currentUserId && message.displayed === false){
								unreadIncomingMessagesNum++;
								if(lastMessageTime === undefined){
									lastMessageTime = message.date_time;
								} else if(lastMessageTime && lastMessageTime < message.date_time){
									lastMessageTime = message.date_time;
								}
						}}
						);
						console.warn("if not undefined than should remove currentBuddyInternal and use this one, "+buddy);
						if(messagesWithCurrentUserNum>0){
							this.state.usersWithMessages.push({
								id: this.state.currentBuddyInternal.id,
								name: this.state.currentBuddyInternal.name,
								surname: this.state.currentBuddyInternal.surname,
								unreadIncomingMessagesNum: unreadIncomingMessagesNum,
								lastMessageTime: lastMessageTime
							});
						}
					}
					
				});
			}
			);
			this.state.usersWithMessages.sort(function(a,b){
				return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
			});
			this.setState(this.state);
		});*/
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
											{/*
                                        <div className="member_list">
											<MessageUsers users={this.state.usersWithMessagesChosen} withMessages={true} setSelectedConversationUser={this.setSelectedConversationUser}/>
										</div>
											*/}
									</div>
                                </div>
                                <div className="col-sm-9 message_section">
								{/*
                                    <Messages selectedConversationUser={this.state.selectedConversationUser} updateSelectedUserInUserViewFn={this.state.updateSelectedUserInUserViewFn}/>
                                */}
								</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }




}