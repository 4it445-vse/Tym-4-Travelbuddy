import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import currentUser from "../../actions/CurrentUser";
import {connect} from "react-redux";
import {openContactBuddy, openNewMeetUp} from "../../actions/modals";
import axios from "../../api";
import ReactStars from "react-stars";

class ShowProfileModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            avatarSrc: undefined,
            ratingValue: undefined,
            ratings: []
        }
    }

    componentDidMount() {
        currentUser.composeProfilePhotoName(this.props.buddy, (avatarSrcResult) => {
            this.setState({
                avatarSrc: avatarSrcResult
            });
        });
        axios.get('BuddyRatings', {
            params: {
                filter: {
                    where: {
                        buddy_id_to: this.props.buddy.id
                    },
                    order: "date_time DESC"
                },
            }
        }).then((response) => {
            const ratings = response.data;
            const numOfRatings = ratings.length;
            let ratingsSum = 0;
            let ratingTexts = [];
            for(let i = 0; i < numOfRatings; i++){
                const rating = ratings[i];
                ratingsSum += rating.rating;
                if(ratingTexts.length <= 5 && rating.text){
                    ratingTexts[i] = rating;
                }
            }
            const ratingValue = Math.round(ratingsSum / numOfRatings);
            this.setState({
                ratingValue,
                ratings
            });
        });
    }

    openContactBuddy = () => {
        this.setState({
            showRequestShowModal: false
        });
        this.props.openContactBuddy({buddy: this.props.buddy});
    }

    openNewMeetUp = () => {
        this.setState({
            showRequestShowModal: false
        });
        this.props.openNewMeetUp({buddy: this.props.buddy});
    }

    render() {
        const {showProp, hideFn, buddy, showContactButton} = this.props;
        console.log("texts: ", this.state.ratings, this.state.ratingValue);
        return (
            <Modal show={showProp} onHide={hideFn}>
                <Modal.Header closeButton>
                    <Modal.Title>{buddy.name + " " + buddy.surname}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="row hidden-sm-up text-xs-center">
                            <img src={ this.state.avatarSrc } alt={ buddy.name + " " + buddy.surname } className="profil_img rounded"/>
                        </div>
                        <hr className="hidden-sm-up"></hr>
                        <div className="col-xs-12 col-sm-6">
                            <div className="row text-xs-left">
                                <div className="col-xs-3 no-padding-right">
                                    <b>Name: </b>
                                </div>
                                <div className="col-xs-9">
                                    {buddy.name + " " + buddy.surname}
                                </div>
                            </div>
                            <div className="row text-xs-left">
                                <div className="col-xs-3 no-padding-right">
                                    <b>City: </b>
                                </div>
                                <div className="col-xs-9">
                                    {buddy.city}
                                </div>
                            </div>
                            <div className="row text-xs-left">
                                <div className="col-xs-3 no-padding-right">
                                    <b>Hosting: </b>
                                </div>
                                <div className="col-xs-9">
                                    {buddy.is_hosting ? "Yes" : "No"}
                                </div>
                            </div>
                            <div className="row text-xs-left">
                                <div className="col-xs-3 no-padding-right">
                                    <b>E-mail: </b>
                                </div>
                                <div className="col-xs-9 ellipsis">
                                    {buddy.email}
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 hidden-xs-down text-sm-center">
                            <img src={ this.state.avatarSrc } alt={ buddy.name + " " + buddy.surname } className="profil_img rounded"/>
                        </div>
                    </div>
                    <div className="row">
                        <hr className="col-xs-12"></hr>
                        <div className="col-xs-12">
                            <p className="no-margin-bottom">{buddy.about_me}</p>
                        </div>
                    </div>
                    { !!this.state.ratingValue ?
                        <div className="row">
                            <hr className="col-xs-12"></hr>
                            <div className="col-xs-12">
                                <ReactStars count={5} value={this.state.ratingValue} half={true} edit={false} size={24} color2={'#ffd700'}/>
                                {
                                    this.state.ratings.map(rating => {
                                        return(<p key={rating.id}>{rating.text}</p>);
                                    })
                                }
                            </div>
                        </div>
                        : ""
                    }
                </Modal.Body>
                <Modal.Footer>
                    <div className="form-check">
                        <button onClick={this.openNewMeetUp} type="button"
                                className="btn btn-primary fullsize">Create meet up proposal
                        </button>
                        {
                            showContactButton ?
                                <div>
                                    <br/>
                                    <button onClick={this.openContactBuddy} type="button"
                                            className="btn btn-primary fullsize">Message
                                    </button>
                                </div>
                                : ""
                        }
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default connect(
    null,
    {
        openContactBuddy,
        openNewMeetUp
    }
)(ShowProfileModal);
