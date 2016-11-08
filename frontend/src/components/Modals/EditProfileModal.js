import React, {Component} from 'react';
import currentUser from '../../actions/CurrentUser';
import AbstractModal from './AbstractModal';
import FormGroup from './FormGroup';

export default class EditProfileModal extends Component {
    render() {
        const {showProp, hideFn, submitFn} = this.props;
        const loggedUser = currentUser.getCurrentUser();
        const title = "Editace profilu - "+loggedUser.name+" "+loggedUser.surname;
        return (
            <AbstractModal title={title} showProp={showProp} hideFn={hideFn}
                           submitFn={submitFn} submitText={"Uložit"}>
                <form>
                    { loggedUser.sex ? "" :
                        <FormGroup>
                            Pohlaví:
                            <select className="form-control" id="sex">
                                <option value="male">Muž</option>
                                <option value="female">Žena</option>
                            </select>
                        </FormGroup>}
                    <FormGroup>
                        Hostuji:
                        <input type="checkbox" className="form-control" id="is_hosting"
                        />
                    </FormGroup>
                    <FormGroup>
                        <input onChange={this.onChangeCity} type="text" className="form-control" id="city"
                               defaultValue={loggedUser.city}/>
                    </FormGroup>
                    <FormGroup>
                                <textarea onChange={this.onChangeCity} type="text" className="form-control"
                                          id="about_me"
                                          defaultValue={loggedUser.about_me}/>
                    </FormGroup>
                </form>
            </AbstractModal>
        );
    }
}