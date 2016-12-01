import React, {Component} from "react";
import currentUser from "../../actions/CurrentUser";
import AbstractModal from "./AbstractModal";
import moment from "moment";
import axios from "../../api";

export default class NewRequestModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            fields: {
                from: moment(new Date()).add(5, 'day').format('YYYY-MM-DD'),
                to: moment(new Date()).add(5, 'day').format('YYYY-MM-DD')
            }
        };

        this.handleSubmitRequest = this.handleSubmitRequest.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    hideModal(){
        this.state.fields = {
            from: moment(new Date()).add(5, 'day').format('YYYY-MM-DD'),
            to: moment(new Date()).add(5, 'day').format('YYYY-MM-DD')
        };
        this.props.hideFn();
    }

    onChange(e) {
        console.log(e.target);
        this.state.fields[e.target.name] = e.target.value;
    }


    handleSubmitRequest() {
        var city = this.state.fields.city;
        var from = this.state.fields.from;
        var to = this.state.fields.to;
        var text = this.state.fields.text;
        var buddy_id = currentUser.getCurrentUser().id;

        var fieldsAreValid = true;

        if (fieldsAreValid) {
            var request = {
                "city": city,
                "from": from,
                "to": to,
                "text": text,
                "buddy_id": buddy_id
            }
            axios.put('Requests', request).then(response => {
                currentUser.setAlert({"type": "success", "message": "Poptávka úspěšně uložena."});
                this.hideModal();
                this.setState({errors: {}});
            }).catch(error => {
                console.log("Chyba: ", error);
                console.log("Chyba: ", error.data);
                console.log("Chyba: ", error.data.error, error.data.error.details);
                this.setState({errors: error.data.error.details.messages});
            });
        }
    }

    render() {
        const {showProp, hideFn} = this.props;
        const {errors} = this.state;
        console.log(errors);
        const title = "Chci jet na novou cestu!";

        return (
            <AbstractModal title={title} showProp={showProp} hideFn={this.hideModal}
                           submitFn={this.handleSubmitRequest} submitText={"Uložit jízdu"}>
                <form>
                    <div className="form-group row text-xs-center">
                        <span>Pokud jedeš na novou cestu a nenašel si nikoho, kdo by hostoval ve tvém městě, napiš pro potencionální hostitele poptávku a vysvětli jim, proč by si měli vybrat právě tebe. Někdo se určitě najde a přijme tě za svého Buddyho!</span>
                    </div>
                    <hr/>
                    <div className="form-group row text-xs-center">
                        <label htmlFor="city" className="col-xs-3 col-sm-2 col-form-label text-xs-right">Město: </label>
                        <div className="col-xs-9 col-sm-10 text-xs-left">
                            <input className={ "form-control" + ( errors.city ? ' alert-danger' : '' ) }
                                   onChange={this.onChange} type="text" name="city"
                                   placeholder="Město, do kterého budete cestovat"/>
                            { errors.city ? <span className="validation-error">{errors.city[1]}</span> : ""}
                        </div>
                    </div>
                    <div className="form-group row text-xs-center">
                        <label htmlFor="from" className="col-xs-2 col-form-label text-xs-right">Datum od:</label>
                        <div className="col-xs-4 text-xs-left">
                            <input className={ "form-control" + ( errors.from ? ' alert-danger' : '' ) }
                                   onChange={this.onChange}
                                   defaultValue={moment(new Date()).add(1, 'day').format('YYYY-MM-DD')} type="date"
                                   name="from" placeholder="YYYY-MM-DD"/>
                            { errors.from ? <span className="validation-error">{errors.from[1]}</span> : ""}
                        </div>
                        <label htmlFor="to" className="col-xs-2 col-form-label text-xs-right">Datum do:</label>
                        <div className="col-xs-4 text-xs-left">
                            <input className={ "form-control" + ( errors.to ? ' alert-danger' : '' ) }
                                   onChange={this.onChange}
                                   defaultValue={moment(new Date()).add(5, 'day').format('YYYY-MM-DD')} type="date"
                                   name="to" placeholder="YYYY-MM-DD"/>
                            { errors.to ? <span className="validation-error">{errors.to[1]}</span> : ""}
                        </div>
                    </div>
                    <div className="form-group row text-xs-center">
                        <label htmlFor="text" className="col-xs-3 col-sm-2 col-form-label text-xs-right">Popis: </label>
                        <div className="col-xs-9 col-sm-10 text-xs-left">
                            <textarea className={ "form-control" + ( errors.text ? ' alert-danger' : '' ) }
                                      onChange={this.onChange} type="text" name="text" rows="3"
                                      placeholder="Vysvětlete potenciálním hostitelům, proč jste právě vy ten pravý/á!"></textarea>
                            { errors.text ? <span className="validation-error">{errors.text[1]}</span> : ""}
                        </div>
                    </div>
                </form>
            </AbstractModal>
        );
    }
}
