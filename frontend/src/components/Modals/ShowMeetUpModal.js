import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import moment from "moment";
import axios from "../../api";
import ReactStars from "react-stars";
import currentUser from "../../actions/CurrentUser";

export default class ShowMeetUpModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            incomingRating: undefined,
            incomingRatingExist: undefined,
            outcomingRating: undefined,
            outcomingRatingExist: undefined
        };
    }

    ratingChanged = (newRating) => {
        this.rating = newRating;
    };

    onChange = (e) => {
        this.ratingText = e.target.value;
    };

    saveRating = () => {
        if (!this.rating) {
            let errors = this.state.errors;
            errors.noRating = "Choose the rating please!";
            this.setState({errors: errors});
            return;
        }
        const rating = {
            text: this.ratingText.replace(/\r?\n/g, '</br>'),
            rating: this.rating,
            date_time: new Date(),
            buddy_id_from: this.props.currentUserId,
            buddy_id_to: this.props.buddy.id,
            meetup_id: this.props.meetUp.id
        };
        axios.put('BuddyRatings', rating).then(response => {
            this.setState({
                outcomingRating: rating,
                outcomingRatingExist: true
            });
        });
    };

    acceptMeetUp = () => {
        axios.post('Meetups/update?where[id]=' + this.props.meetUp.id, {verified: true}).then(response => {
            this.props.meetUp.verified = true;
            this.props.hideFn();
        });
    };

    setMeetUpAsDone = () => {
        axios.post('Meetups/update?where[id]=' + this.props.meetUp.id, {done: true}).then(response => {
            this.props.meetUp.done = true;
            this.props.hideFn();
        });
    };

    render() {
        const {showProp, buddy, hideFn} = this.props;

        const otherBuddyId = this.props.buddy.id;
        const {ratings} = this.props.meetUp;
        let outcomingRating = undefined;
        let incomingRating = undefined;
        let incomingRatingExist = false;
        let outcomingRatingExist = false;
        if (ratings[0]) {
            if (ratings[0].buddy_id_from === otherBuddyId) {
                incomingRating = ratings[0];
                incomingRatingExist = true;
            } else {
                outcomingRating = ratings[0];
                outcomingRatingExist = true;
            }
        }
        if (ratings[1]) {
            if (ratings[1].buddy_id_from === otherBuddyId) {
                incomingRating = ratings[1];
                incomingRatingExist = true;
            } else {
                outcomingRating = ratings[1];
                outcomingRatingExist = true;
            }
        }

        return (
            <Modal show={showProp} onHide={hideFn}>
                <Modal.Header closeButton>
                    <Modal.Title>{"Meet up with " + buddy.name + " " + buddy.surname}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="row text-xs-left">
                                <div className="col-xs-4 no-padding-right">
                                    <b>With whom? </b>
                                </div>
                                <div className="col-xs-8">
                                    {buddy.name + " " + buddy.surname}
                                </div>
                            </div>
                            <div className="row text-xs-left">
                                <div className="col-xs-3 no-padding-right">
                                    <b>When? </b>
                                </div>
                                <div className="col-xs-9">
                                    { moment(this.props.meetUp.date_time).format(currentUser.dateFormat) }
                                </div>
                            </div>
                        </div>
                        {
                            this.props.isBuddyView === true && this.props.meetUp.verified === false ?
                                <button onClick={this.acceptMeetUp} type="button"
                                        className="btn btn-primary fullsize">Accept!
                                </button>
                                : ""
                        }
                        {
                            this.props.meetUp.done === false && this.props.meetUp.verified === true &&
                            (new Date(this.props.meetUp.date_time).getTime() - new Date().getTime()) <= 0
                                ?
                                <button onClick={this.setMeetUpAsDone} type="button"
                                        className="btn btn-primary fullsize">Set as done!
                                </button>
                                : ""
                        }
                        {
                            this.props.meetUp.verified === true && this.props.meetUp.done === true ?
                                incomingRating === undefined && incomingRatingExist === undefined ? "" :
                                    incomingRating === undefined && incomingRatingExist === false ?
                                        ""
                                        :
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <div className="row text-xs-left">
                                                <div className="col-xs-4 no-padding-right">
                                                    <b>{"Rating from " + buddy.name + ": "}</b>
                                                </div>
                                            </div>
                                            <div className="row text-xs-left">
                                                <div className="col-xs-9 ellipsis">
                                                    <ReactStars count={5} value={incomingRating.rating} half={true} edit={false} onChange={this.ratingChanged} size={24} color2={'#ffd700'}/>
                                                </div>
                                            </div>
                                            <div className="row text-xs-left">
                                                <div className="col-xs-9 ellipsis" dangerouslySetInnerHTML={{__html: incomingRating.text}}>
                                                </div>
                                            </div>
                                        </div>
                                : ""
                        }

                        {
                            this.props.meetUp.verified === true && this.props.meetUp.done ?
                                outcomingRating === undefined && outcomingRatingExist === undefined ? "" :
                                    outcomingRating === undefined && outcomingRatingExist === false ?
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <div className="row text-xs-left">
                                                <div className="col-xs-4 no-padding-right">
                                                    <b>{"Your rating: "}</b>
                                                </div>
                                            </div>
                                            {
                                                !!this.state.errors.noRating ?
                                                    <span className="validation-error">{this.state.errors.noRating}</span> : ""
                                            }
                                            <ReactStars count={5} half={true} onChange={this.ratingChanged} size={24} color2={'#ffd700'}/>
                                            <textarea className="form-control"
                                                      onChange={this.onChange} type="text" name="text" rows="3" placeholder={"Give " + buddy.name + " a rating!"}/>
                                            <button onClick={this.saveRating} type="button"
                                                    className="btn btn-primary fullsize">Save rating
                                            </button>
                                        </div>
                                        :
                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                            <div className="row text-xs-left">
                                                <div className="col-xs-4 no-padding-right">
                                                    <b>{"Your rating: "}</b>
                                                </div>
                                            </div>
                                            <div className="row text-xs-left">
                                                <div className="col-xs-9 ellipsis">
                                                    <ReactStars count={5} value={outcomingRating.rating} half={true} edit={false} onChange={this.ratingChanged} size={24} color2={'#ffd700'}/>
                                                </div>
                                            </div>
                                            <div className="row text-xs-left">
                                                <div className="col-xs-9 ellipsis" dangerouslySetInnerHTML={{__html: outcomingRating.text}}>
                                                </div>
                                            </div>
                                        </div>
                                : ""
                        }
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}