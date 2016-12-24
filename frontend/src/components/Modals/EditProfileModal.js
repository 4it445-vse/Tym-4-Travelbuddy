import React, {Component} from "react";
import currentUser from "../../actions/CurrentUser";
import AbstractModal from "./AbstractModal";
import FormGroup from "./FormGroup";
import axios from "../../api";
import GooglePlacesSuggest from "../Autosuggest/SuggestCity";
import validation from "../../Validation/Validation";
import { connect } from "react-redux";
import { logInUser } from "../../actions/user";
class EditProfileModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            fields: {},
            avatarSrc: undefined
        }

        this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onChangeImg = this.onChangeImg.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.loadUserData = this.loadUserData.bind(this);
    }

    componentDidMount() {
        this.loadUserData();
    }

    loadUserData() {
        axios.get('buddies/'+this.props.user.id).then(response =>{
            let fields = this.state.fields;
            let currentUserLocal = response.data;
            fields.city = currentUserLocal.city;
            fields.about_me = currentUserLocal.about_me;
            fields.is_hosting = currentUserLocal.is_hosting;
            const profilePhotoName = currentUser.composeProfilePhotoName(currentUserLocal);
            if (profilePhotoName) {
                this.setState({
                    fields: fields,
                    avatarSrc: profilePhotoName
                });
            }
        });
    }

    hideModal() {
        var fields = {};
        const currentUserLocal = this.props.user;
        fields.city = currentUserLocal.city;
        fields.about_me = currentUserLocal.about_me;

        this.state = {
            errors: {},
            fields: fields,
            avatarSrc: this.state.avatarSrc
        };
        this.props.hideFn();
    }

    onChangeImg(e) {
        const fileInput = e.target.files[0];
        var filesize = (fileInput.size / 1024 / 1024).toFixed(2);
    }

    onClick() {
        var data = new FormData();
        var photo = this.refs.File.files[0];
        const name = photo.name;
        const currentUserLocal = this.props.user;
        data.append("file", photo);
        const containerName = 'container_' + currentUserLocal.id;
        axios.post('containers/' + containerName + '/upload', data).then(data => {
            let constructedBuddy = {
                "profile_photo_name": name
            };
            axios.post('buddies/update?where[id]=' + currentUserLocal.id, {"profile_photo_name": name})
                .then(response => {
                    this.setState({
                        avatarSrc: name
                    });
                });
        });
    }

    onChange(e) {
        let name = e.target.name;
        let value = e.target.value;
        var is_hosting = document.getElementById("is_hosting").checked;
        let errors = this.state.errors;
        let fields = this.state.fields;
        errors[name] = validation.validate(name, value, is_hosting);
        fields[name] = value;
        console.log(name, value, fields);

        this.setState({
            errors: errors,
            fields: fields
        });
    }

    handleSubmitEdit() {
        const {city, about_me} = this.state.fields;
        var is_hosting = document.getElementById("is_hosting").checked;
        var sex;
        if (this.props.user.sex === 'na') {
            let e = document.getElementById("sex");
            sex = e.options[e.selectedIndex].value;
        } else {
            sex = this.props.user.sex;
        }

        for (var name of ["city", "about_me"]) {
            let obj = {
                target: {
                    value: this.state.fields[name],
                    name: name
                }
            };
            this.onChange(obj);
        }
        let fieldsAreValid = true;
        for (var name of ["city", "about_me"]) {
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
        let _this = this;
        axios.post('buddies/update?where[id]=' + currentUserLocal.id, constructedBuddy).then(response => {
            this.hideModal();
        });
    }

    handleSearchChange = (e) => {
        this.setState({city: e.target.value})
    }

    handleSelectSuggest = (suggestName, coordinate) => {
        var fields = this.state.fields;
        fields.city = suggestName;
        this.setState({fields: fields});
    }

    render() {
        const {showProp} = this.props;
        const {errors} = this.state;
        const loggedUser = this.props.user;
        const title = "Edit Profile: " + loggedUser.name + " " + loggedUser.surname;
        return (
            <AbstractModal title={title} showProp={showProp} hideFn={this.hideModal}
                           submitFn={this.handleSubmitEdit} submitText={"Save"}>
                <form>
                    <div className="form-group no-margin-bottom row">
                        <label className="col-xs-6 col-form-label">Name: {loggedUser.name}</label>
                        <label className="col-xs-6 col-form-label">Surname: {loggedUser.surname}</label>
                    </div>
                    <div className="form-group no-margin-bottom row">
                        <label className="col-xs-12 col-form-label">Email: {loggedUser.email}</label>
                    </div>
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
                            <GooglePlacesSuggest onSelectSuggest={ this.handleSelectSuggest } search={ this.state.fields.city } display={false}>
                                <input
                                    className={ "form-control" + ( !!errors.city ? ' alert-danger' : '' ) }
                                    value={this.state.fields.city} onBlur={this.onChange} onChange={this.onChange}
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
                            <img src={ this.state.avatarSrc } alt="..." className="editProfile_Avatar rounded"/>
                        </div>
                        <div className="col-xs-6 text-xs-left">
                            <input
                                type="file"
                                placeholder="Vybrat soubor"
                                accept="image/*"
                                ref="File"
                                onChange={this.onChangeImg}
                            />
                            <input
                                type="button"
                                value="Nahrát"
                                onClick={this.onClick}
                            />
                        </div>
                    </div>
                </form>
            </AbstractModal>
        );


    }
}
export default connect(
    (state) => ({
        user : state.user
    }),
    {
        logInUser
    }
)(EditProfileModal);