import React, {Component, Button} from "react";
import Message from "./Message";

export default class MessageSend extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messageText: ""
        }
        this.submitSendMessage = this.submitSendMessage.bind(this);
        this.setMessageText = this.setMessageText.bind(this);
    }

    setMessageText(e) {
        var text = e.target.value;
        this.setState({messageText: text});
    }

    submitSendMessage() {
        var text = this.state.messageText.replace(/\r?\n/g, '</br>');
        if (text) {
            this.setState({messageText: ""});
            this.props.sendMessage(text);
            event.target.value = "";
        }
    }

    render() {
        const {sendMessage} = this.props;
        return (
            <div className="message_write">
                {
                    !!sendMessage ?
                        <div>
                            <textarea onChange={this.setMessageText} value={this.state.messageText}
                                      className="form-control" placeholder="Napiš zprávu"></textarea>
                            <div className="clearfix"></div>
                            <div className="chat_bottom">
                                {!!this.props.sendMessage ?
                                    <a href="#" className="float-right btn btn-primary"
                                       onClick={this.submitSendMessage}>Odeslat
                                        zprávu</a>
                                    :
                                    <a href="#" className="float-right btn btn-primary">Odeslat zprávu</a> }
                            </div>
                        </div>
                        : ""
                }
            </div>
        );
    }


}