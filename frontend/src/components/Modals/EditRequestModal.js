import React, {Component} from "react";
import AbstractModal from "./AbstractModal";
import Select from "react-select";
import axios from "../../api";
import moment from 'moment';
import currentUser from "../../actions/CurrentUser";

export default class RequestModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            requests: [],
            request: {
                city: null,
                from: null,
                to: null,
                text: null
            },
            showValidation: {
                city: false,
                text: false
            },
            selectedRequest: null
        };

        this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
        this.findBuddysRequests = this.findBuddysRequests.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.prepareRemoveRequest = this.prepareRemoveRequest.bind(this);
        this.removeRequest = this.removeRequest.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    hideModal(){
        this.state = {
            errors: {},
            requests: [],
            request: {
                city: null,
                from: null,
                to: null,
                text: null
            },
            showValidation: {
                city: false,
                text: false
            },
            selectedRequest: null
        };
        this.props.hideFn();
    }

    prepareRemoveRequest() {
        currentUser.setQuestion({
            text: "Chcete opravdu odstranit tuto poptávku?",
            cb: this.removeRequest
        });
        this.props.hideFn();
    }

    removeRequest() {
        var id = this.state.selectedRequest
        axios.delete('Requests/' + id).then(response => {
            console.log("ok");
            currentUser.setAlert({"type": "success", "message": "Poptávka úspěšně odstraněna."});
            this.props.hideFn();
        });
    }

    validate(name, value, fields) {
        var showValidation = this.state.showValidation;
        if (value) {
            fields[name] = value;
            showValidation[name] = true;
            this.setState({
                fields: fields,
                showValidation: showValidation
            });
        } else {
            fields[name] = undefined;
            showValidation[name] = true;
            this.setState({
                fields: fields,
                showValidation: showValidation
            });
        }
    }


    onChange(e) {
        console.log(e.target);
        let name = e.target.name;
        let value = e.target.value;
        let errors = this.state.errors;
        let fields = this.state.request;
        switch (name) {
            case "city":
                this.validate(name, value, fields);
                break;
            case "text":
                this.validate(name, value, fields);
                break;
            case "from":
                if (value) {
                    if (moment(value).isValid()) {
                        errors[name] = undefined;
                        fields[name] = value;
                        this.setState({
                            errors: errors,
                            fields: fields
                        });
                    } else {
                        errors[name] = "Datum je bohužel ve špatném formátu.";
                        fields[name] = value;
                        this.setState({
                            errors: errors,
                            fields: fields
                        });
                    }
                } else {
                    errors[name] = "Potřebujeme vědět, od kdy plánujete cestu.";
                    fields[name] = value;
                    this.setState({
                        errors: errors,
                        fields: fields
                    });
                }
                break;
            case "to":
                if (value) {
                    if (moment(value).isValid()) {
                        errors[name] = undefined;
                        fields[name] = value;
                        this.setState({
                            errors: errors,
                            fields: fields
                        });
                    } else {
                        errors[name] = "Datum je bohužel ve špatném formátu.";
                        fields[name] = value;
                        this.setState({
                            errors: errors,
                            fields: fields
                        });
                    }
                } else {
                    errors[name] = "Potřebujeme vědět, do kdy plánujete cestu.";
                    fields[name] = value;
                    this.setState({
                        errors: errors,
                        fields: fields
                    });
                }
        }
    }

    findBuddysRequests() {
        axios.get('Requests', {
            params: {filter: {where: {buddy_id: currentUser.getCurrentUser().id}}}
        })
            .then(response => {
                //Remapping response beacuase of Select component
                var requestsFormated = response.data.map(function (object) {
                    var remappedObj = {value: object.id, label: object.city};
                    return remappedObj;
                })
                this.setState({
                    requests: requestsFormated, selectedRequest: requestsFormated[0],
                    request: {
                        city: requestsFormated[0].city,
                        from: requestsFormated[0].from,
                        to: requestsFormated[0].to,
                        text: requestsFormated[0].text
                    }
                });
                this.handleSelectChange(this.state.selectedRequest);
            })
    }

    handleSubmitEdit() {
        var id = this.state.request.id;
        var city = this.state.request.city;
        var from = this.state.request.from;
        var to = this.state.request.to;
        var text = this.state.request.text;
        var buddy_id = currentUser.getCurrentUser().id;

        var fieldsAreValid = true;
        this.state.showValidation.city = true;
        this.state.showValidation.text = true;
        for( var name of ["city", "from", "to", "text"]){
            if(!this.state.request[name]){
                fieldsAreValid = false;
            }
        }

        if (fieldsAreValid) {
            var updatedRequest = {
                "city": city,
                "from": from,
                "to": to,
                "text": text,
                "buddy_id": buddy_id
            }
            axios.patch('Requests/' + id, updatedRequest).then(response => {
                currentUser.setAlert({"type": "success", "message": "Poptávka úspěšně upravena."});
                this.hideModal();
            })
                .then(() => {
                    this.findBuddysRequests();
                })
                .catch(error => {
                    const {response} = error;
                    this.setState({errors: response.data.error.details.messages});
                });
        }else{
            this.setState(this.state);
        }
    }

    handleSelectChange(requestFormated) {
        console.log("in handleSelectChange");
        axios.get('Requests/' + requestFormated.value)
            .then(response => {
                this.setState({request: response.data});
            });
        this.setState({selectedRequest: requestFormated.value});
    }

    componentDidMount() {
        this.findBuddysRequests();
    }

    render() {
        const {showProp, hideFn, switchFn} = this.props;
        const {errors} = this.state;
        const title = "Editovat moje jízdy";

        const dateFormat = "YYYY-MM-DD";
        var fromFormated = moment(this.state.request.from).format(dateFormat);
        var toFormated = moment(this.state.request.to).format(dateFormat);

        if (this.state.requests.length === 0 ) {
            return (
                <AbstractModal title={title} showProp={showProp} hideFn={hideFn} submitFn={switchFn}
                               submitText={"Chci někam jet!"}>
                    <p>Bohužel, ještě jste nevytvořil/a žádné jízdy a proto je nemůžete editovat.</p>
                    <p>Novou jízdu si můžete vytvořit v sekci: Chci někam jet!</p>
                </AbstractModal>
            );
        }
        console.log("HERE ###: ", this.state.request, this.state.showValidation);
        return (
            <AbstractModal title={title} showProp={showProp} hideFn={this.hideModal}
                           submitFn={this.handleSubmitEdit} submitText={"Uložit jízdu"}>
                <form>
                    <div className="form-group row text-xs-center">
                        <label htmlFor="rides" className="col-xs-6 col-form-label text-xs-right">Vyberte jízdu, kterou
                            chcete editovat: </label>
                        <div className="col-xs-6">
                            <Select name="form-field-name" value={this.state.selectedRequest}
                                    options={this.state.requests} onChange={this.handleSelectChange}/>
                            <a href="#" onClick={this.prepareRemoveRequest}>odstranit požadavek</a>
                        </div>
                    </div>
                    <hr/>
                    <div className="form-group row text-xs-center">
                        <label htmlFor="city" className="col-xs-3 col-sm-2 col-form-label text-xs-right">Město: </label>
                        <div className="col-xs-9 col-sm-10 text-xs-left">
                            <input className={ "form-control" + ( this.state.showValidation.city && !this.state.request.city ? ' alert-danger' : '' ) }
                                   value={this.state.request.city} onBlur={this.onChange} onChange={this.onChange} type="text"
                                   name="city" placeholder="Město, do kterého budete cestovat"/>
                            { this.state.showValidation.city && !this.state.request.city ? <span className="validation-error">Město je povinné pole, to abychom Vás mohli najít.</span> : ""}
                        </div>
                    </div>
                    <div className="form-group row text-xs-center">
                        <label htmlFor="from" className="col-xs-2 col-form-label text-xs-right">Datum od:</label>
                        <div className="col-xs-4">
                            <input className={ "form-control" + ( errors.from ? ' alert-danger' : '' ) }
                                   value={fromFormated} onChange={this.onChange} type="date" name="from"
                                   placeholder="YYYY-MM-DD"/>
                            { errors.from ? <span className="validation-error">{errors.from}</span> : ""}
                        </div>
                        <label htmlFor="to" className="col-xs-2 col-form-label text-xs-right">Datum do:</label>
                        <div className="col-xs-4">
                            <input className={ "form-control" + ( errors.to ? ' alert-danger' : '' ) }
                                   value={toFormated} onChange={this.onChange} type="date" name="to"
                                   placeholder="YYYY-MM-DD"/>
                            { errors.to ? <span className="validation-error">{errors.to}</span> : ""}
                        </div>
                    </div>
                    <div className="form-group row text-xs-center">
                        <label htmlFor="text" className="col-xs-3 col-sm-2 col-form-label text-xs-right">Popis: </label>
                        <div className="col-xs-9 col-sm-10 text-xs-left">
                            <textarea className={ "form-control" + ( this.state.showValidation.text && !this.state.request.text ? ' alert-danger' : '' ) }
                                      value={this.state.request.text} onBlur={this.onChange} onChange={this.onChange} type="text"
                                      name="text" rows="3"
                                      placeholder="Vysvětlete potenciálním hostitelům, proč jste právě vy ten pravý/á!"></textarea>
                            { this.state.showValidation.text && !this.state.request.text ? <span className="validation-error">Řekněte něco o sobě potencionálním buddíkům!</span> : ""}
                        </div>
                    </div>
                </form>
            </AbstractModal>
        );
    }
}
