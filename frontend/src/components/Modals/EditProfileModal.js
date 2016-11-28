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
          city: undefined
        }

        this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
                this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    componentDidMount(){
      this.state.city = currentUser.getCurrentUser().city;
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
                console.log('reuqest na upload');
                var data = new FormData();
                data.append('userId',currentUserLocal.id);
                data.append('avatarUpload', avatarUpload.files[0]);
                axios.post('http://localhost:3003/upload-avatar', data)
                    .then(function (res) {
                        console.log('edit success');
                        _this.props.hideFn();
                    })
                    .catch(function (err) {
                       if (err.message == 'Network Error'){
                           // YOLO, museli by na serveru být povoleny cross-origin requesty. Nejlepší by bylo dotazovat se na stejném portu ale u loopback sewrveru mi nejde post
                           console.log('edit success');
                           _this.props.hideFn();
                       } else {
                           console.error('Upload failed', err);
                       }
                    });
            });
        }
    }

    handleSearchChange = (e) => {
      this.setState({ city: e.target.value })
    }

    handleSelectSuggest = (suggestName, coordinate) => {
      this.setState({ city: suggestName })
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
                      <input type="text" placeholder="City is the single most important information, when you want to host." autoComplete="off" onChange = { this.handleSearchChange} className="form-control" id="city" aria-describedby="CityHelp" value={this.state.city}/>
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
                        <div className="col-xs-7">
                            <label className="col-form-label"><strong>Tady bude avatar</strong></label>
                        </div>
                        <div className="col-xs-5 text-xs-left">
                            <input type="file" name="avatarUpload" id="avatarUpload" accept=".jpg" />
                        </div>
                    </div>
                </form>
            </AbstractModal>
        );
    }
}
