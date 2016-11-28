import React, {Component} from "react";
import Message from "./Message";
import MessageSend from "./MessageSend";
import currentUser from "../actions/CurrentUser";

export default class Messages extends Component {
	
	constructor(props){
		super(props);
		this.state = {
			messages: []
		};
		this.findMessages = this.findMessages.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
	}
	
	sendMessage(message) {
		axios.post('messages', {
			'text': message,
			'displayed': false,
			'buddy_id_from': currentUser.getCurrentUser().id,
			'buddy_id_to': this.props.selectedConversationUser.id
		}).then(response => {
			console.log('### Message successfully sent. from '+currentUser.getCurrentUser().id+' to '+this.props.selectedConversationUser.id);
			this.setState(this.state);
		});
	}
	
	findMessages(value){
		if(selectedConversationUser && this.props.selectedConversationUser.lastMessageTime){
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
					console.log("Buddy with id: "+buddyMessages[0].buddy_id_to+" has "+buddyMessages.size+" messages in Messages.");
					buddyMessages.map(message => {
						if(message.buddy_id_to === currentUserId){
							this.state.messages.push({
								"text": message.text,
								"time": message.date_time,
								"isIncoming": true
							});
						} else {
							this.state.messages.push({
								"text": message.text,
								"time": message.date_time,
								"isIncoming": false
							});
					}}
					);
					this.state.messages.sort(function(a,b){
						return new Date(b.time) - new Date(a.time);
					});
					this.setState(this.state);
				}else {
					this.setState({
						incomingMessages: [],
						outcomingMessages: []
					});
				}
				
			});
            axios.post('messages/update', {displayed: true}).then(response => {
                console.log('message set as read '+response.data);
				this.props.updateSelectedUserInUserViewFn();
            });
		}else{
			this.setState({
				incomingMessages: [],
				outcomingMessages: []
			});
		}
	}
	
    render() {
		{ selectedConversationUser } = this.props;
		this.findMessages();
        return (
			<div className="row">
				<div className="new_message_head">
					<div className="push-right">
					{!!selectedConversationUser ? "Konverzace s uživatelem "+selectedConversationUser.name+" "+selectedConversationUser.surname:
					"Prosím vyberte si konverzaci"}
					</div>
				</div>
				<div className="chat_area">
					<ul className="list-unstyled">
					{
						this.state.messages.map(message =>
							<Message message={message}/>
						);
					}
					</ul>
				</div>
				<MessagSend sendMessage={this.sendMessage}/>
			</div>
        );
    }




}