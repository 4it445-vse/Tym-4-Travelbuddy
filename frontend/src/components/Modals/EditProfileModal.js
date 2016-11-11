import React, {Component} from 'react';
import currentUser from '../../actions/CurrentUser';
import AbstractModal from './AbstractModal';
import FormGroup from './FormGroup';
import axios from '../../api';

export default class EditProfileModal extends Component {
	
	constructor(props){
		super(props);
		
		this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
	}
	

    handleSubmitEdit() {
        var city = document.getElementById("city").value;
        var about_me = document.getElementById("about_me").value;
        var is_hosting = document.getElementById("is_hosting").checked;
        var sex;
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
            axios.put('buddies/' + currentUser.getCurrentUser().id, constructedBuddy).then(response => {
                console.log('registration success');
                this.props.hideFn();
                currentUser.setCurrentUser(constructedBuddy);
            });
        }
    }
	
    render() {
        const {showProp, hideFn} = this.props;
        const loggedUser = currentUser.getCurrentUser();
        const title = "Editace profilu - "+loggedUser.name+" "+loggedUser.surname;
        return (
            <AbstractModal title={title} showProp={showProp} hideFn={hideFn}
                           submitFn={this.handleSubmitEdit} submitText={"Uložit"}>
                <form>
                    { loggedUser.sex === "na" ?
                        <FormGroup>
                            Pohlaví:
                            <select className="form-control" id="sex">
                                <option value="male">Muž</option>
                                <option value="female">Žena</option>
                            </select>
                        </FormGroup> : ""}
                    <FormGroup>
                        Hostuji:
                        <input type="checkbox" className="form-control" id="is_hosting" defaultChecked={loggedUser.is_hosting}
                        />
                    </FormGroup>
                    <FormGroup>
                        <input onChange={this.onChangeCity} type="text" className="form-control" id="city"
                               defaultValue={loggedUser.city}/>
                    </FormGroup>
                    <FormGroup>
                                <textarea type="text" className="form-control"
                                          id="about_me"
                                          defaultValue={loggedUser.about_me}/>
                    </FormGroup>
                </form>
            </AbstractModal>
        );
    }
}