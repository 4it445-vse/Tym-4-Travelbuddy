import React, {Component} from "react";
//import { Link } from 'react-router';

export class Message extends Component {
    render() {
        return (
            <div className="row">
                <div className="v-o-5">
                    <div className="main_section">
                        <div className="container">
                            <div className="chat_container">
                                <div className="col-sm-3 chat_sidebar">
                                    <div className="row">
                                        <div className="dropdown-toggle">
                                            Všechna konverzace: <span className="caret float-right"></span>
                                        </div>
                                        <div className="input-group">
                                            <input id="search-people" type="search"
                                                   className="form-control SearchBar SearchHeight SearchBorder bt2"
                                                   placeholder="Hledej jméno"/>
                                              <span className="input-group-btn">
                                                    <button className="btn btn-defaul SearchButton SearchHeight text-white bt1" type="button">Hledej</button>
                                              </span>
                                        </div>
                                        <div className="member_list">
                                            <ul className="list-unstyled">
                                                <li className="left clearfix">
                                                      <span className="chat-img float-left">
                                                 <img src="https://i.imgur.com/UePbdph.jpg" alt="User Avatar" className="img-circle" />
                                                      </span>
                                                    <div className="chat-body clearfix">
                                                        <div className="header_sec">
                                                            <strong className="primary-font">Jack Sparrow</strong>
                                                            <strong className="float-right">
                                                                09:45AM</strong>
                                                        </div>
                                                        <div className="contact_sec">
                                                            <span
                                                                className="badge float-right">Máte 3 nepřečtené zprávy</span>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="left clearfix">
                                                        <span className="chat-img float-left">
                                                            <img src="https://i.imgur.com/UePbdph.jpg" alt="User Avatar" className="img-circle"/>
                                                        </span>
                                                    <div className="chat-body clearfix">
                                                        <div className="header_sec">
                                                            <strong className="primary-font">Jack Sparrow</strong>
                                                            <strong className="float-right ">
                                                                09:45AM</strong>
                                                        </div>
                                                        <div className="contact_sec">
                                                            <span
                                                                className="badge float-right">Máte 3 nepřečtené zprávy</span>
                                                        </div>
                                                    </div>
                                                </li>

                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-9 message_section">
                                    <div className="row">
                                        <div className="new_message_head">
                                            <div className="push-right">
                                                Konverzace s uživatelem Alex Palo
                                            </div>
                                        </div>
                                        <div className="chat_area">
                                            <ul className="list-unstyled">
                                                <li className="left clearfix">
                                                    <span className="chat-img1 float-left">
                                                           <img src="https://i.imgur.com/UePbdph.jpg" alt="User Avatar" className="img-circle"/>
                                                     </span>
                                                    <div className="chat-body1 clearfix">
                                                        <p><b>10:40</b><br/>Contrary to popular belief, Lorem Ipsum is
                                                            not simply random text. It has roots in a piece of classical
                                                            Latin literature from 45 BC, making it over 2000 years old.
                                                            Richard McClintock, a Latin professor at Hampden-Sydney
                                                            College in Virginia.</p>
                                                    </div>
                                                </li>
                                                <li className="left clearfix admin_chat">
                                                        <span className="chat-img1 float-right">
                                                             <img src="https://i.imgur.com/UePbdph.jpg" alt="User Avatar" className="img-circle"/>
                                                        </span>
                                                    <div className="chat-body2 clearfix">
                                                        <p><b className="float-right">09:40</b><br/>Contrary to popular
                                                            belief, Lorem Ipsum is not simply random text. It has roots
                                                            in a piece of classical Latin literature from 45 BC, making
                                                            it over 2000 years old. Richard McClintock, a Latin
                                                            professor at Hampden-Sydney College in Virginia.</p>

                                                    </div>
                                                </li>
                                                <li className="left clearfix">
                                                     <span className="chat-img1 float-left">
                                                         <img src="https://i.imgur.com/UePbdph.jpg" alt="User Avatar" className="img-circle"/>
                                                     </span>
                                                    <div className="chat-body1 clearfix">
                                                        <p><b>09:30</b><br/>Contrary to popular belief, Lorem Ipsum is
                                                            not simply random text. It has roots in a piece of classical
                                                            Latin literature from 45 BC, making it over 2000 years old.
                                                            Richard McClintock, a Latin professor at Hampden-Sydney
                                                            College in Virginia.</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="message_write">
                                            <textarea className="form-control" placeholder="Napiš zprávu"></textarea>
                                            <div className="clearfix"></div>
                                            <div className="chat_bottom">
                                                <a href="#" className="float-right btn btn-primary">Odeslat zprávu</a></div>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        );
    }




}