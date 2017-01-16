import React, {Component} from "react";
import moment from "moment";

export default class Message extends Component {
    render() {
        const {message} = this.props;
        var messageDate = new Date(message.time);
        var today = new Date();
        var isTodayMessage = messageDate.getDate() === today.getDate() && messageDate.getMonth() === today.getMonth() && messageDate.getFullYear() === today.getFullYear();
        return (
            <li className="left clearfix">
				<span className={"chat-img1 " + (message.isIncoming ? 'float-left' : 'float-right')}>
					   <img src={ message.avatarSrc } alt="User Avatar" className="img-circle"/>
				 </span>
                <div className={"chat-body1 clearfix" + (message.isIncoming ? '' : ' my-message')}>
                    <p><b
                        className={message.isIncoming ? "" : "float-right"}>{isTodayMessage ? moment(message.time).format('LT') : moment(message.time).format('lll')}</b><br/>
                        <div dangerouslySetInnerHTML={{__html: message.text}}/>
                    </p>
                </div>
            </li>
        );
    }


}