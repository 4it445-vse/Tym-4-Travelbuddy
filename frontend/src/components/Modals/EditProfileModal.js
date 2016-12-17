import React, {Component} from "react";
import currentUser from "../../actions/CurrentUser";
import AbstractModal from "./AbstractModal";
import FormGroup from "./FormGroup";
import axios from "../../api";
import GooglePlacesSuggest from "../Autosuggest/SuggestCity"

export default class EditProfileModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            city: undefined,
            avatarSrc: undefined
        }

        this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.loadPhoto = this.loadPhoto.bind(this);
    }

    componentDidMount() {
        this.state.city = currentUser.getCurrentUser().city;
        this.loadPhoto();
    }

    loadPhoto() {
        const currentUserLocal = currentUser.getCurrentUser();
        console.log(currentUserLocal);
        const profilePhotoName = currentUser.composeProfilePhotoName(currentUserLocal);
        if (profilePhotoName) {
            this.setState({
                avatarSrc: profilePhotoName
            });
        }
    }

    onChange(e) {
        const fileInput = e.target.files[0];
        var filesize = (fileInput.size / 1024 / 1024).toFixed(2);
        console.log(filesize < 1)
        console.log(fileInput.name);
    }

    onClick() {
        var data = new FormData();
        console.log('in here');
        var photo = this.refs.File.files[0];
        console.log('file ', photo);
        const name = photo.name;
        const currentUserLocal = currentUser.getCurrentUser();
        data.append("file", photo);
        console.log(photo);
        const containerName = 'container_' + currentUserLocal.id;
        axios.post('containers/' + containerName + '/upload', data).then(data => {
            let constructedBuddy = {
                "profile_photo_name": name
            };
            axios.post('buddies/update?where[id]=' + currentUserLocal.id, {"profile_photo_name": name})
                .then(response => {
                    console.log("name of photo stored");
                    currentUserLocal.profile_photo_name = name;
                    currentUser.updateCurrentUser(currentUserLocal);
                    this.loadPhoto();
                });
        });
    }

    handleSubmitEdit() {
        var city = document.getElementById("city").value;
        var about_me = document.getElementById("about_me").value;
        var is_hosting = document.getElementById("is_hosting").checked;
        var sex;
        var avatarUpload = document.getElementById("avatarUpload");
        if (currentUser.getCurrentUser().sex === 'na') {
            let e = document.getElementById("sex");
            sex = e.options[e.selectedIndex].value;
        } else {
            sex = currentUser.getCurrentUser().sex;
        }
        if (city) {
            let currentUserLocal = currentUser.getCurrentUser();
            let constructedBuddy = {
                "sex": sex,
                "city": city,
                "is_hosting": is_hosting,
                "about_me": about_me
            };
            let _this = this;
            axios.post('buddies/update?where[id]=' + currentUserLocal.id, constructedBuddy).then(response => {
                currentUserLocal.sex = constructedBuddy.sex;
                currentUserLocal.city = constructedBuddy.city;
                currentUserLocal.is_hosting = constructedBuddy.is_hosting;
                currentUserLocal.about_me = constructedBuddy.about_me;

                currentUser.setCurrentUser(currentUserLocal);
            }).then(response => {
                if (!!avatarUpload.files[0]) {
                    console.log('reuqest na upload');
                    var data = new FormData();
                    data.append('userId', currentUserLocal.id);
                    data.append('avatarUpload', avatarUpload.files[0]);
                    axios.post('http://localhost:3003/upload-avatar', data)
                        .then(function (res) {
                            console.log('edit success');
                            _this.props.hideFn();
                            location.reload();
                        });
                }
            });
        }
    }

    handleSearchChange = (e) => {
        this.setState({city: e.target.value})
    }

    handleSelectSuggest = (suggestName, coordinate) => {
        this.setState({city: suggestName})
    }

    render() {
        const {showProp, hideFn} = this.props;
        const loggedUser = currentUser.getCurrentUser();
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
                            <GooglePlacesSuggest onSelectSuggest={ this.handleSelectSuggest } search={ this.state.city } display={true}>
                                <input type="text" placeholder="City is the single most important information, when you want to host." autoComplete="off" onChange={ this.handleSearchChange}
                                       className="form-control" id="city" aria-describedby="CityHelp" value={this.state.city}/>
                            </GooglePlacesSuggest>
                        </div>
                    </div>
                    <div className="form-group no-margin-bottom row">
                        <label className="col-xs-12 col-form-label">Description: </label>
                        <div className="col-xs-12">
                            <textarea type="text" className="form-control" id="about_me" aria-describedby="AboutHelp"
                                      defaultValue={loggedUser.about_me} placeholder="Tell something about you to pontetial buddies."/>
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
                                onChange={this.onChange}
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
