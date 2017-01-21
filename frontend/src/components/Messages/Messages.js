import React, {Component} from "react";
import Message from "./Message";
import MessageSend from "./MessageSend";
import axios from "../../api";
import ReactDOM from "react-dom";
import {connect} from "react-redux";
import {openProfile} from "../../actions/modals";

class Messages extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            selectedConversationUser: undefined
        };
    }

    componentDidMount() {
        this.props.setFindUserMessages(this.findMessages);
    }

    componentDidUpdate() {
        var len = this.state.messages.length - 1;
        const node = ReactDOM.findDOMNode(this['_div' + len]);
        if (node) {
            node.scrollIntoView();
        }
    }

    sendMessage = (message) => {
        var obj = {
            'text': message,
            'displayed': false,
            'date_time': new Date(),
            'buddy_id_from': this.props.user.id,
            'buddy_id_to': this.state.selectedConversationUser.id
        };

        axios.post('messages', obj).then(response => {
            this.props.incrementCheckPoint();
            this.findMessages(this.state.selectedConversationUser);
            this.props.refreshUsers();
        });
    }

    findMessages = (selectedConversationUser) => {
        this.state.messages = [];
        if (selectedConversationUser && selectedConversationUser.lastMessageTime) {
            axios.get('messages', {
                params: {
                    filter: {
                        where: {
                            or: [
                                {
                                    "buddy_id_to": this.props.user.id,
                                    "buddy_id_from": selectedConversationUser.id
                                },
                                {
                                    "buddy_id_from": this.props.user.id,
                                    "buddy_id_to": selectedConversationUser.id
                                }
                            ]
                        }
                    }
                }
            }).then(response => {
                let buddyMessages = response.data;
                if (buddyMessages && buddyMessages[0]) {
                    const localCurrentUser = this.props.user;
                    let profilePhotoName;
                    let profilePhotoNameCU;
                    buddyMessages.map(message => {
                            if (message.buddy_id_to === localCurrentUser.id) {
                                if (!profilePhotoName) {
                                    profilePhotoName = selectedConversationUser.avatarSrc;
                                }
                                this.state.messages.push({
                                    "text": message.text,
                                    "time": message.date_time,
                                    "isIncoming": true,
                                    "fromUser": message.buddy_id_from,
                                    "avatarSrc": profilePhotoName
                                });
                            } else {
                                if (!profilePhotoNameCU) {
                                    profilePhotoNameCU = this.props.user.avatarSrc;
                                }
                                this.state.messages.push({
                                    "text": message.text,
                                    "time": message.date_time,
                                    "isIncoming": false,
                                    "fromUser": message.buddy_id_from,
                                    "avatarSrc": profilePhotoNameCU
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
            });
            let updateObject = {
                where: {
                    buddy_id_from: selectedConversationUser.id,
                    buddy_id_to: this.props.user.id
                }
            };
            axios.post('/messages/messages-displayed', updateObject).then(response => {
                this.props.updateSelectedUserInUserViewFn();
            });
        } else {
            this.setState({
                messages: [],
                selectedConversationUser: selectedConversationUser
            });
        }
    }

    openProfile = () => {
        axios.get('buddies/' + this.state.selectedConversationUser.id).then(response => {
            this.props.openProfile({buddy: response.data, flag:true});
        });
    }

    render() {
        const {selectedConversationUser} = this.state;
        return (
            <div className="row">
                <div className="new_message_head">
                    <div className="push-right">
                        {!!selectedConversationUser ? <div>Conversetaion with buddy <a href="#" onClick={this.openProfile}>{selectedConversationUser.fullname}</a></div> :
                            "Please choose a conversation."}
                    </div>
                </div>
                <div className="chat_area" id={ !!selectedConversationUser ? "" : "chat_area_noone_selected"}>
                    <ul className="list-unstyled">
                        {
                            this.state.messages.map((message, idx) =>
                                <Message key={message.id} message={message} ref={(ref) => this['_div' + idx] = ref}/>
                            )
                        }
                    </ul>
                </div>
                <MessageSend sendMessage={!!selectedConversationUser ? this.sendMessage : undefined}/>
            </div>
        );
    }


}
export default connect(
    (state) => ({
        user: state.user
    }),
    {
        openProfile
    }
)(Messages)