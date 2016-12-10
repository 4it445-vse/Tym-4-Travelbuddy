import React, {Component} from "react";
import MessageUser from "./MessageUser";

export default class MessageUsers extends Component {
    render() {
		const { users, setSelectedConversationUser, selectedConversationUser } = this.props;
		console.log("MessageUsers users: ", users);
        return (
			<ul className="list-unstyled">
			{
				users.map( (user, idx) =>
					<MessageUser key={idx} user={user} setSelectedConversationUser={setSelectedConversationUser} selectedConversationUser={selectedConversationUser}/>
				)
			}
			</ul>
        );
    }




}