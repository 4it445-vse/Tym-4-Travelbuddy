import React, {Component} from "react";
import moment from 'moment';

export default class MessageUser extends Component {
	
	constructor(props){
		super(props);
		this.state = {
			isChanged: false
		};
		this.setSelectedConversationUser = this.setSelectedConversationUser.bind(this);
		this.setUserChanged = this.setUserChanged.bind(this);
	}
	
	setUserChanged(){
		this.setState({
			isChanged: true
		});
	}
	
	setSelectedConversationUser(){
		this.props.setSelectedConversationUser(this.props.user, this.setUserChanged);
	}
	
    render() {
		const { user } = this.props;
		console.log("MessageUser user: ", user);
        return (
			<li className="left clearfix" onClick={this.setSelectedConversationUser}>
				  <span className="chat-img float-left">
			 <img src="https://i.imgur.com/UePbdph.jpg" alt="User Avatar" className="img-circle" />
				  </span>
				<div className="chat-body clearfix">
					<div className="header_sec">
						<strong className="primary-font">{user.fullname}</strong>
						<strong className="float-right">
							{moment(user.lastMessageTime).format('lll')}
						</strong>
					</div>
					<div className="contact_sec">
					{user.unreadIncomingMessagesNum && !this.state.isChanged > 0 ?
						<span className="badge float-right">{user.unreadIncomingMessagesNum}</span> : ""
					}
					</div>
				</div>
			</li>
        );
    }




}