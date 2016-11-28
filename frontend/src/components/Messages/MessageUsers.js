import React, {Component} from "react";
import MessageUser from "./MessageUser";

export default class MessageUsers extends Component {
    render() {
		const { users, withMessages, setSelectedConversationUser } = this.props;
        return (
			<ul className="list-unstyled">
			{
				users.map(user => 
					<MessageUser user={user} withMessages={withMessages} setSelectedConversationUser={setSelectedConversationUser}/>
				)
			}
			</ul>
        );
    }




}