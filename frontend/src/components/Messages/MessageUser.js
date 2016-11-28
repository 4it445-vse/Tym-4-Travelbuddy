import React, {Component} from "react";

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
		this.props.setSelectedConversationUser(this.props.user, setUserChanged);
	}
	
    render() {
		const { user, withMessages } = this.props;
        return (
			<li className="left clearfix" onClick={this.setSelectedConversationUser}>
				  <span className="chat-img float-left">
			 <img src="https://i.imgur.com/UePbdph.jpg" alt="User Avatar" className="img-circle" />
				  </span>
				<div className="chat-body clearfix">
					<div className="header_sec">
						<strong className="primary-font">{user.name+" "+user.surname</strong>
						{withMessages ?
						<strong className="float-right">
							{user.lastMessageTime}</strong> : ""
						}
					</div>
					<div className="contact_sec">
					{withMessages && user.unreadIncomingMessagesNum && !this.state.isChanged >0 ?
						<span className="badge float-right">{user.unreadIncomingMessagesNum}</span> : ""
					}
					</div>
				</div>
			</li>
        );
    }




}