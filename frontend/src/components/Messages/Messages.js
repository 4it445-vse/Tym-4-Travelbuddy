import React, {Component} from "react";
import Message from "./Message";
import MessageSend from "./MessageSend";
import currentUser from "../../actions/CurrentUser";
import axios from "../../api";

export default class Messages extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            selectedConversationUser: undefined
        };
        this.findMessages = this.findMessages.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidMount() {
        this.props.setFindUserMessages(this.findMessages);
    }

    sendMessage(message) {
        var obj = {
            'text': message,
            'displayed': false,
            'date_time': new Date(),
            'buddy_id_from': currentUser.getCurrentUser().id,
            'buddy_id_to': this.state.selectedConversationUser.id
        };
        console.log("in sendMessage, obj: ", obj);

        axios.post('messages', obj).then(response => {
            console.log('### Message successfully sent. from ' + currentUser.getCurrentUser().id + ' to ' + this.props.selectedConversationUser.id);
            this.findMessages(this.state.selectedConversationUser)
        });
    }

    findMessages(selectedConversationUser) {
        this.state.messages = [];
        console.log("in findMessages");
        if (selectedConversationUser && selectedConversationUser.lastMessageTime) {
            axios.get('messages', {
                params: {
                    filter: {
                        where: {
                            or: [
                                {
                                    "buddy_id_to": currentUser.getCurrentUser().id,
                                    "buddy_id_from": selectedConversationUser.id
                                },
                                {
                                    "buddy_id_from": currentUser.getCurrentUser().id,
                                    "buddy_id_to": selectedConversationUser.id
                                }
                            ]
                        }
                    }
                }
            }).then(response => {
                let buddyMessages = response.data;
                if (buddyMessages && buddyMessages[0]) {
                    //console.log("Buddy with id: "+buddyMessages[0].buddy_id_to+" has "+buddyMessages.size+" messages in Messages.");
                    buddyMessages.map(message => {
                            if (message.buddy_id_to === currentUser.getCurrentUser().id) {
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
                            }
                        }
                    );
                    this.state.messages.sort(function (a, b) {
                        return new Date(a.time) - new Date(b.time);
                    });
                    let state = this.state;
                    state.selectedConversationUser = selectedConversationUser;
                    this.setState(state);
                } else {
                    this.setState({
                        messages: [],
                        selectedConversationUser: selectedConversationUser
                    });
                }
                console.log("Messages: ", this.state.messages);
            });
            let updateObject = {
                where: {
                    buddy_id_from: selectedConversationUser.id,
                    buddy_id_to: currentUser.getCurrentUser().id
                }
            };
            console.log("Where udate object: ", updateObject);
            axios.post('/messages/messages-displayed', updateObject).then(response => {
                console.log('message set as read ' + response.data);
                this.props.updateSelectedUserInUserViewFn();
            });
        } else {
            this.setState({
                messages: [],
                selectedConversationUser: selectedConversationUser
            });
        }
    }

    render() {
        const {selectedConversationUser} = this.state;
        return (
            <div className="row">
                <div className="new_message_head">
                    <div className="push-right">
                        {!!selectedConversationUser ? "Konverzace s uživatelem " + selectedConversationUser.fullname :
                            "Prosím vyberte si konverzaci"}
                    </div>
                </div>
                <div className="chat_area">
                    <ul className="list-unstyled">
                        {
                            this.state.messages.map(message =>
                                <Message key={message.id} message={message}/>
                            )
                        }
                    </ul>
                </div>
                <MessageSend sendMessage={!!selectedConversationUser ? this.sendMessage : undefined}/>
            </div>
        );
    }


}