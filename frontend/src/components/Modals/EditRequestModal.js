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
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.state.request[e.target.name] = e.target.value;
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
          this.setState({ requests: requestsFormated, selectedRequest: requestsFormated[0],
          request: {
            city: requestsFormated[0].city,
            from: requestsFormated[0].from,
            to: requestsFormated[0].to,
            text: requestsFormated[0].text
          }});
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
               <input className={ "form-control" + ( errors.city ? ' alert-danger' : '' ) } defaultValue={this.state.request.city} onChange={this.onChange} type="text" name="city" placeholder="Město, do kterého budete cestovat"/>
               { errors.city ? <span className="validation-error">{errors.city[1]}</span> : ""}
             </div>
           </div>
           <div className="form-group row text-xs-center">
             <label htmlFor="from" className="col-xs-2 col-form-label text-xs-right">Datum od:</label>
             <div className="col-xs-4">
               <input className={ "form-control" + ( errors.from ? ' alert-danger' : '' ) } defaultValue={fromFormated} onChange={this.onChange} type="date" name="from" placeholder="YYYY-MM-DD"/>
               { errors.from ? <span className="validation-error">{errors.from[1]}</span> : ""}
             </div>
             <label htmlFor="to" className="col-xs-2 col-form-label text-xs-right">Datum do:</label>
             <div className="col-xs-4">
               <input className={ "form-control" + ( errors.to ? ' alert-danger' : '' ) } defaultValue={toFormated} onChange={this.onChange} type="date" name="to" placeholder="YYYY-MM-DD"/>
               { errors.to ? <span className="validation-error">{errors.to[1]}</span> : ""}
             </div>
           </div>
           <div className="form-group row text-xs-center">
             <label htmlFor="text" className="col-xs-3 col-sm-2 col-form-label text-xs-right">Popis: </label>
             <div className="col-xs-9 col-sm-10 text-xs-left">
               <textarea className={ "form-control" + ( errors.text ? ' alert-danger' : '' ) } defaultValue={this.state.request.text} onChange={this.onChange} type="text" name="text" rows="3" placeholder="Vysvětlete potenciálním hostitelům, proč jste právě vy ten pravý/á!"></textarea>
               { errors.text ? <span className="validation-error">{errors.text[1]}</span> : ""}
             </div>
           </div>
         </form>
      </AbstractModal>
    );
  }
}
