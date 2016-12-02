import React, {Component} from "react";
import MessageUser from "./MessageUser";

export default class MessageUsers extends Component {
    render() {
		const { users, setSelectedConversationUser } = this.props;
		console.log("MessageUsers users: ", users);
        return (
			<ul className="list-unstyled">
			{
				users.map(user => 
					<MessageUser key={user.fullname} user={user} setSelectedConversationUser={setSelectedConversationUser}/>
				)
			}
			</ul>
        );
    }




}