import React, {Component} from "react";
import Message from "./Message";

export default class MessageSend extends Component {
	
	constructor(props){
		super(props);
		this.submitSendMessage = this.submitSendMessage.bind(this);
	}
	
	submitSendMessage(){
		var text = event.target.value;
		if(text){
			this.props.sendMessage(text);
			event.target.value = "";
		}
	}
	
    render() {
        return (
			<div className="message_write">
				<textarea className="form-control" placeholder="Napiš zprávu"></textarea>
				<div className="clearfix"></div>
				<div className="chat_bottom">
					<a href="#" className="float-right btn btn-primary" onClick={this.submitSendMessage}>Odeslat zprávu</a>
				</div>
			</div>
        );
    }




}