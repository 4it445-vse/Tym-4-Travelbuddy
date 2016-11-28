import React, {Component} from "react";

export default class Message extends Component {
    render() {
		const { message } = this.props;
        return (
			<li className="left clearfix">
				<span className={"chat-img1 " + (message.isIncoming ? 'float-right' : 'float-left')}>
					   <img src="https://i.imgur.com/UePbdph.jpg" alt="User Avatar" className="img-circle"/>
				 </span>
				<div className="chat-body1 clearfix">
					<p><b className={message.isIncoming ? "float-right" : ""}>10:40</b><br/>
						{message.text}
					</p>
				</div>
			</li>
        );
    }




}