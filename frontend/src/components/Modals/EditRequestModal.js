import React, {Component} from "react";
import currentUser from "../../actions/CurrentUser";
import AbstractModal from "./AbstractModal";
import Select from "react-select";
import axios from "../../api";
import moment from 'moment';

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
        selectedRequest: null
    };

    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
    this.findBuddysRequests = this.findBuddysRequests.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  findBuddysRequests() {
      axios.get('Requests', { params: { filter: { where: { buddy_id: currentUser.getCurrentUser().id } } }
      })
      .then(response => {
        //Remapping response beacuase of Select component
          var requestsFormated = response.data.map(function(object) {
            var remappedObj = { value: object.id, label: object.city};
            return remappedObj;
          })
          this.setState({ requests: requestsFormated, selectedRequest: requestsFormated[0] });
          this.handleSelectChange(this.state.selectedRequest);
      })
  }

  handleSubmitEdit() {
    var id = this.state.request.id;
    var city = document.getElementById("city").value;
    var from = document.getElementById("from").value;
    var to = document.getElementById("to").value;
    var text = document.getElementById("text").value;
    var buddy_id = currentUser.getCurrentUser().id;

    var fieldsAreValid = true;

    if (fieldsAreValid) {
      var updatedRequest = {
        "city": city,
        "from": from,
        "to": to,
        "text": text,
        "buddy_id": buddy_id
      }
      axios.patch('Requests/' + id, updatedRequest).then(response => {
          this.props.hideFn();
      })
      .then(() => {
        this.findBuddysRequests();
      })
      .catch(error => {
        const { response } = error;
        this.setState({ errors: response.data.error.details.messages });
      });
    }
  }

  handleSelectChange(requestFormated) {
    axios.get('Requests/' + requestFormated.value)
    .then(response => {
        this.setState({ request: response.data });
    });
    this.setState({ selectedRequest: requestFormated.value});
  }

  handleCityChange(event) {
    this.setState({ request: { ...this.state.request, city: event.target.value }});
  }
  handleFromChange(event) {
    this.setState({ request: { ...this.state.request, from: event.target.value }});
  }
  handleToChange(event) {
    this.setState({ request: { ...this.state.request, to: event.target.value }});
  }
  handleTextChange(event) {
    this.setState({ request: { ...this.state.request, text: event.target.value }});
  }

  componentDidMount() {
    this.findBuddysRequests();
  }

  render() {
    const {showProp, hideFn, switchFn} = this.props;
    const { errors } = this.state;
    const title = "Editovat moje jízdy";

    const dateFormat = "YYYY-MM-DD";
    var fromFormated = moment(this.state.request.from).format(dateFormat);
    var toFormated = moment(this.state.request.to).format(dateFormat);

    if (this.state.requests.length === 0) {
      return (
        <AbstractModal title={title} showProp={showProp} hideFn={hideFn} submitFn={switchFn} submitText={"Chci někam jet!"}>
           <p>Bohužel, ještě jste nevytvořil/a žádné jízdy a proto je nemůžete editovat.</p>
           <p>Novou jízdu si můžete vytvořit v sekci: Chci někam jet!</p>
        </AbstractModal>
      );
    }

    return (
      <AbstractModal title={title} showProp={showProp} hideFn={hideFn}
                     submitFn={this.handleSubmitEdit} submitText={"Uložit jízdu"}>
         <form>
           <div className="form-group row text-xs-center">
             <label htmlFor="rides" className="col-xs-6 col-form-label text-xs-right">Vyberte jízdu, kterou chcete editovat: </label>
             <div className="col-xs-6">
             <Select name="form-field-name" value={this.state.selectedRequest} options={this.state.requests} onChange={this.handleSelectChange}/>
             </div>
           </div>
           <hr/>
           <div className="form-group row text-xs-center">
             <label htmlFor="city" className="col-xs-3 col-sm-2 col-form-label text-xs-right">Město: </label>
             <div className="col-xs-9 col-sm-10 text-xs-left">
               <input className={ "form-control" + ( errors.city ? ' alert-danger' : '' ) } value={this.state.request.city} onChange={this.handleCityChange} type="text" id="city" placeholder="Město, do kterého budete cestovat"/>
               { errors.city ? <span className="validation-error">{errors.city[1]}</span> : ""}
             </div>
           </div>
           <div className="form-group row text-xs-center">
             <label htmlFor="from" className="col-xs-2 col-form-label text-xs-right">Datum od:</label>
             <div className="col-xs-4">
               <input className={ "form-control" + ( errors.from ? ' alert-danger' : '' ) } value={fromFormated} onChange={this.handleFromChange} type="date" id="from" placeholder="YYYY-MM-DD"/>
               { errors.from ? <span className="validation-error">{errors.from[1]}</span> : ""}
             </div>
             <label htmlFor="to" className="col-xs-2 col-form-label text-xs-right">Datum do:</label>
             <div className="col-xs-4">
               <input className={ "form-control" + ( errors.to ? ' alert-danger' : '' ) } value={toFormated} onChange={this.handleToChange} type="date" id="to" placeholder="YYYY-MM-DD"/>
               { errors.to ? <span className="validation-error">{errors.to[1]}</span> : ""}
             </div>
           </div>
           <div className="form-group row text-xs-center">
             <label htmlFor="text" className="col-xs-3 col-sm-2 col-form-label text-xs-right">Popis: </label>
             <div className="col-xs-9 col-sm-10 text-xs-left">
               <textarea className={ "form-control" + ( errors.text ? ' alert-danger' : '' ) } value={this.state.request.text} onChange={this.handleTextChange} type="text" id="text" rows="3" placeholder="Vysvětlete potenciálním hostitelům, proč jste právě vy ten pravý/á!"></textarea>
               { errors.text ? <span className="validation-error">{errors.text[1]}</span> : ""}
             </div>
           </div>
         </form>
      </AbstractModal>
    );
  }
}
