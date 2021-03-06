import React, {Component} from "react";
import AbstractModal from "./AbstractModal";
import FormGroup from "./FormGroup";
import axios from "../../api";
import ReactStars from "react-stars";
import GooglePlacesSuggest from "../Autosuggest/SuggestCity";
import validation from "../../Validation/Validation";
import {connect} from "react-redux";
import {logInUser, updateUser} from "../../actions/user";
import AvatarCropper from "react-avatar-cropper";
import FileUpload from "../Images/FileUpload";
import currentUser from "../../actions/CurrentUser";
class EditProfileModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            fields: {},
            avatarSrc: undefined,
            displayCitySuggest: false,
            cropperOpen: false,
            img: null,
            ratingValue: undefined
        }
    }

    componentDidMount() {
        this.loadUserData();

        axios.get('BuddyRatings', {
            params: {
                filter: {
                    where: {
                        buddy_id_to: this.props.user.id
                    }
                },
            }
        }).then((response) => {
            const ratings = response.data;
            const numOfRatings = ratings.length;
            let ratingsSum = 0;
            for(let i = 0; i < numOfRatings; i++){
                const rating = ratings[i];
                ratingsSum += rating.rating;
            }
            const ratingValue = Math.round(ratingsSum / numOfRatings);
            this.setState({
                ratingValue
            });
        });
    }

    loadUserData = () => {
        axios.get('buddies/' + this.props.user.id).then(response => {
            let fields = this.state.fields;
            let currentUserLocal = response.data;
            fields.city = currentUserLocal.city;
            fields.about_me = currentUserLocal.about_me;
            fields.is_hosting = currentUserLocal.is_hosting;
            currentUser.composeProfilePhotoName(currentUserLocal, (avatarSrcResult) => {
                this.setState({
                    fields: fields,
                    avatarSrc: avatarSrcResult
                });
            });
        });
    };

    storePhoto = (dataUri) => {
        let data = new FormData();
        let photo = new File([dataUri], "filename");
        const name = photo.name;
        const currentUserLocal = this.props.user;
        data.append("file", photo);
        const containerName = 'container_' + currentUserLocal.id;
        axios.post('containers/' + containerName + '/upload', data).then(() => {
            axios.post('buddies/update?where[id]=' + currentUserLocal.id, {"profile_photo_name": name})
                .then(() => {
                    let currentUserLocal = this.props.user;
                    if(!currentUserLocal.profile_photo_name){
                        currentUserLocal.profile_photo_name = name;
                        this.props.updateUser(currentUserLocal);
                    }
                    this.setState({
                        avatarSrc: dataUri
                    });
                });
        });
    };

    onChange = (e) => {
        const {name, value} = e.target;

        if (name === 'city' && value) {
            this.validate(name, value, true);
        } else {
            this.validate(name, value);
        }
    };

    onBlur = (e) => {
        const {name, value} = e.target;

        this.validate(name, value);
    };

    validate = (name, value, displayCitySug) => {
        let is_hosting = document.getElementById("is_hosting").checked;
        let {errors, fields, displayCitySuggest} = this.state;
        errors[name] = validation.validate(name, value, is_hosting);
        fields[name] = value;

        if (displayCitySug) {
            displayCitySuggest = true;
        }

        this.setState({
            errors: errors,
            fields: fields,
            displayCitySuggest: displayCitySuggest
        });
    };

    handleSubmitEdit = () => {
        const {city, about_me} = this.state.fields;
        let is_hosting = document.getElementById("is_hosting").checked;
        let sex;
        if (this.props.user.sex === 'na') {
            let e = document.getElementById("sex");
            sex = e.options[e.selectedIndex].value;
        } else {
            sex = this.props.user.sex;
        }

        for (let name of ["city", "about_me"]) {
            let obj = {
                target: {
                    value: this.state.fields[name],
                    name: name
                }
            };
            this.onChange(obj);
        }
        let fieldsAreValid = true;
        for (let name of ["city", "about_me"]) {
            if (this.state.errors[name] !== undefined) {
                fieldsAreValid = false;
            }
        }
        if (fieldsAreValid === false) {
            return;
        }

        let currentUserLocal = this.props.user;
        let constructedBuddy = {
            "sex": sex,
            "city": city,
            "is_hosting": is_hosting,
            "about_me": about_me
        };
        axios.post('buddies/update?where[id]=' + currentUserLocal.id, constructedBuddy).then(() => {
            currentUserLocal.sex = sex;
            currentUserLocal.city = city;
            currentUserLocal.is_hosting = is_hosting;
            currentUserLocal.about_me = about_me;
            this.props.updateUser(currentUserLocal);
            this.props.hideFn();
        });
    };

    handleSearchChange = (e) => {
        this.setState({city: e.target.value})
    };

    handleSelectSuggest = (suggestName, coordinate) => {
        let fields = this.state.fields;
        fields.city = suggestName;
        this.setState({fields: fields});
    };

    handleFileChange = (dataURI) => {
        this.setState({
            img: dataURI,
            avatarSrc: this.state.avatarSrc,
            cropperOpen: true
        });
    };

    handleCrop = (dataURI) => {
        this.storePhoto(dataURI);
        this.setState({
            cropperOpen: false,
            img: null,
            avatarSrc: require("../../images/lazyload.gif")
        });
    };

    handleRequestHide = () => {
        this.setState({
            cropperOpen: false
        });
    };

    render() {
        const {showProp,hideFn} = this.props;
        const {errors} = this.state;
        const loggedUser = this.props.user;
        const title = "Edit Profile: " + loggedUser.name + " " + loggedUser.surname;
        return (
            <AbstractModal title={title} showProp={showProp} hideFn={hideFn}
                           submitFn={this.handleSubmitEdit} submitText={"Save"}>
                <form>
                    <div className="form-group no-margin-bottom row">
                        <label className="col-xs-6 col-form-label">Name: {loggedUser.name}</label>
                        <label className="col-xs-6 col-form-label">Surname: {loggedUser.surname}</label>
                    </div>
                    <div className="form-group no-margin-bottom row">
                        <label className="col-xs-12 col-form-label">Email: {loggedUser.email}</label>
                    </div>

                    { !!this.state.ratingValue ?
                        <div className="form-group no-margin-bottom row">
                            <div className="col-xs-12">
                                <ReactStars count={5} value={this.state.ratingValue} half={true} edit={false} size={24} color2={'#ffd700'}/>
                            </div>
                        </div>
                        : ""
                    }

                    <hr/>
                    { loggedUser.sex === "na" ?
                        <FormGroup>
                            Sex:
                            <select className="form-control" id="sex">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </FormGroup> : ""}
                    <div className="form-group no-margin-bottom row">
                        <label className="col-xs-12 col-form-label">City: </label>
                        <div className="col-xs-12">
                            <GooglePlacesSuggest onSelectSuggest={ this.handleSelectSuggest } search={ this.state.fields.city } display={this.state.displayCitySuggest}>
                                <input
                                    className={ "form-control" + ( !!errors.city ? ' alert-danger' : '' ) }
                                    value={this.state.fields.city} onBlur={this.onBlur} onChange={this.onChange}
                                    type="text"
                                    name="city" placeholder="City is the single most important information, when you want to host."
                                    autoComplete="off"
                                    aria-describedby="CityHelp"/>
                                { !!errors.city ?
                                    <span className="validation-error">{errors.city}</span> : ""}
                            </GooglePlacesSuggest>
                        </div>
                    </div>
                    <div className="form-group no-margin-bottom row">
                        <label className="col-xs-12 col-form-label">Description: </label>
                        <div className="col-xs-12">
                            <textarea
                                className={ "form-control" + ( !!errors.about_me ? ' alert-danger' : '' ) }
                                value={this.state.fields.about_me} onChange={this.onChange}
                                type="text"
                                name="about_me" rows="3"
                                placeholder="Tell something about you to pontetial buddies."
                                aria-describedby="AboutHelp"/>
                            { !!errors.about_me ? <span
                                className="validation-error">{errors.about_me}</span> : ""}
                        </div>
                    </div>
                    <hr/>
                    <div className="form-group no-margin-bottom row">
                        <div className="col-xs-7 text-xs-right">
                            <label className="col-form-label"><strong>Want to host! </strong></label>
                        </div>
                        <div className="col-xs-5 text-xs-left">
                            <input type="checkbox" className="form-check-input big_checkbox" id="is_hosting"
                                   defaultChecked={loggedUser.is_hosting}/>
                        </div>
                    </div>
                    <hr/>
                    <div className="form-group no-margin row">
                        <div className="col-xs-6">
                            <img src={this.state.avatarSrc}/>
                            {this.state.cropperOpen &&
                            <AvatarCropper id="avatar-croper"
                                onRequestHide={this.handleRequestHide}
                                cropperOpen={this.state.cropperOpen}
                                onCrop={this.handleCrop}
                                image={this.state.img}
                                width={300}
                                height={300}
                            />
                            }
                        </div>
                        <div className="col-xs-12 text-xs-left">
                            <FileUpload handleFileChange={this.handleFileChange}/>
                        </div>
                    </div>
                </form>
            </AbstractModal>
        );


    }
}
export default connect(
    (state) => ({
        user: state.user
    }),
    {
        logInUser,
        updateUser
    }
)(EditProfileModal);