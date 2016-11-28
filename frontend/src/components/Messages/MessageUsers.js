import React, {Component} from "react";
import MessageUser from "./MessageUser";

export default class MessageUsers extends Component {
    render() {
		{ users, withMessages, setSelectedConversationUser } = this.props;
        return (
			<div className="member_list">
				<ul className="list-unstyled">
					users.map(user => 
						<MessageUser user={user} withMessages={withMessages} setSelectedConversationUser={setSelectedConversationUser}/>
					);
				</ul>
			</div>

        );
    }




}