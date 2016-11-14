import React, {Component} from "react";
import currentUser from "../../actions/CurrentUser";
import AbstractModal from "./AbstractModal";
import FormGroup from "./FormGroup";
import axios from "../../api";

export default class EditProfileModal extends Component {

    constructor(props) {
        super(props);

        this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
    }


    handleSubmitEdit() {
        var city = document.getElementById("city").value;
        var about_me = document.getElementById("about_me").value;
        var is_hosting = document.getElementById("is_hosting").checked;
        var sex;
	console.log(currentUser.getCurrentUser().sex);
        if (currentUser.getCurrentUser().sex === 'na') {
            let e = document.getElementById("sex");
            sex = e.options[e.selectedIndex].value;
        } else {
            sex = currentUser.getCurrentUser().sex;
        }
        if (city) {
            let currentUserLocal = currentUser.getCurrentUser();
            let constructedBuddy = {
                "email": currentUser.getCurrentUser().email,
                "password": currentUser.getCurrentUser().password,
                "sex": sex,
                "city": city,
                "is_hosting": is_hosting,
                "about_me": about_me,
                "name": currentUser.getCurrentUser().name,
                "surname": currentUser.getCurrentUser().surname,
                "id": currentUser.getCurrentUser().id

            };
console.log(constructedBuddy);
            axios.put('buddies/' + currentUser.getCurrentUser().id, constructedBuddy).then(response => {
                console.log('edit success');
                this.props.hideFn();
                currentUser.setCurrentUser(constructedBuddy);
            });
        }
    }

    render() {
        const {showProp, hideFn} = this.props;
        const loggedUser = currentUser.getCurrentUser();
        const title = "Editace profilu - " + loggedUser.name + " " + loggedUser.surname;
        return (
            <AbstractModal title={title} showProp={showProp} hideFn={hideFn}
                           submitFn={this.handleSubmitEdit} submitText={"Uložit"}>
              <form>
                <div className="form-group no-margin row">
                  <label className="col-xs-6 col-form-label">Jméno: {loggedUser.name}</label>
                  <label className="col-xs-6 col-form-label">Přijmení: {loggedUser.surname}</label>
                </div>
                <div className="form-group no-margin row">
                  <label className="col-xs-12 col-form-label">Email: {loggedUser.email}</label>
                </div>
                <hr/>
{ loggedUser.sex === "na" ?
                        <FormGroup>
                            Pohlaví:
                            <select className="form-control" id="sex">
                                <option value="male">Muž</option>
                                <option value="female">Žena</option>
                            </select>
                        </FormGroup> : ""}
                <div className="form-group no-margin row">
                  <label for="city" className="col-xs-12 col-form-label">Město: </label>
                  <div className="col-xs-12">
                    <input type="text" className="form-control" id="city" aria-describedby="CityHelp" defaultValue={loggedUser.city}/>
                    <small id="emailHelp" className="form-text text-muted text-xs-center">Město je pro nás nejdůležitější informace, pokud chceš hostovat.</small>
                  </div>
                </div>
                <div className="form-group no-margin row">
                  <label for="about_me" className="col-xs-12 col-form-label">Popis: </label>
                  <div className="col-xs-12">
                    <textarea type="text" className="form-control" id="about_me" aria-describedby="AboutHelp" defaultValue={loggedUser.about_me}/>
                    <small id="emailHelp" className="form-text text-muted text-xs-center">Řekni něco o sobě potencionálním budíkům!</small>
                  </div>
                </div>
                <hr/>
                <div className="form-group no-margin row">
                  <div className="col-xs-7 text-xs-right">
                    <label for="is_hosting" className="col-form-label"><strong>Chci hostovat! </strong></label>
                  </div>
                  <div className="col-xs-5 text-xs-left">
                    <input type="checkbox" className="form-check-input big_checkbox" id="is_hosting" defaultChecked={loggedUser.is_hosting}/>
                  </div>
                </div>
              </form>
            </AbstractModal>
        );
    }
}
