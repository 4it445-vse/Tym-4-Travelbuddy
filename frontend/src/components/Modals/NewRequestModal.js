import React, {Component} from "react";
import currentUser from "../../actions/CurrentUser";
import AbstractModal from "./AbstractModal";
import moment from "moment";
import axios from "../../api";
import lodash from 'lodash';

export default class NewRequestModal extends Component {

    constructor(props) {
      super(props);
      this.state = {
        errors: {},
      };

      this.handleSubmitRequest = this.handleSubmitRequest.bind(this);
      this.handleSubmitRequestDebounced = lodash.debounce(this.handleSubmitRequest, 300);
    }

    handleSubmitRequest(isOnChange) {
      var request = {
        "city": document.getElementById("city").value,
        "from": document.getElementById("from").value,
        "to": document.getElementById("to").value,
        "text": document.getElementById("text").value,
        "buddy_id": currentUser.getCurrentUser().id,
        "onChange": isOnChange
      }

      axios.put('Requests', request).then(response => {
        currentUser.setAlert({"type": "success", "message": "Poptávka úspěšně uložena." });
        this.setState({errors: {}});
        this.props.hideFn();
      }).catch(error => {
        const { response } = error;
        const { messages } = response.data.error.details;
        this.setState({ errors: messages });
      });
    }

    render() {
      const {showProp, hideFn} = this.props;
      const {errors} = this.state;

      const title = "Chci jet na novou cestu!";
      const todayPlusOne = moment(new Date()).add(1, 'day').format('YYYY-MM-DD');
      const todayPlusFive = moment(new Date()).add(5, 'day').format('YYYY-MM-DD');

      return (
          <AbstractModal title={title} showProp={showProp} hideFn={hideFn}
                         submitFn={() => this.handleSubmitRequest(false)} submitText={"Uložit jízdu"}>
              <form>
                  <div className="form-group row text-xs-center">
                      <span>Pokud jedeš na novou cestu a nenašel si nikoho, kdo by hostoval ve tvém městě, napiš pro potencionální hostitele poptávku a vysvětli jim, proč by si měli vybrat právě tebe. Někdo se určitě najde a přijme tě za svého Buddyho!</span>
                  </div>
                  <hr/>
                  <div className="form-group row text-xs-center">
                      <label htmlFor="city" className="col-xs-3 col-sm-2 col-form-label text-xs-right">City: </label>
                      <div className="col-xs-9 col-sm-10 text-xs-left">
                          <input className={ "form-control" + ( errors.city ? ' alert-danger' : '' ) } onChange={() => this.handleSubmitRequestDebounced(true)}
                                 type="text" id="city" placeholder="Město, do kterého budete cestovat"/>
                          { errors.city ? <span className="validation-error">{errors.city[1]}</span> : ""}
                      </div>
                  </div>
                  <div className="form-group row text-xs-center">
                      <label htmlFor="from" className="col-xs-2 col-form-label text-xs-right">From:</label>
                      <div className="col-xs-4 text-xs-left">
                          <input className={ "form-control" + ( errors.from ? ' alert-danger' : '' ) } onChange={() => this.handleSubmitRequestDebounced(true)}
                                 defaultValue={todayPlusOne} type="date" id="from" placeholder="YYYY-MM-DD"/>
                          { errors.from ? <span className="validation-error">{errors.from[1]}</span> : ""}
                      </div>
                      <label htmlFor="to" className="col-xs-2 col-form-label text-xs-right">To:</label>
                      <div className="col-xs-4 text-xs-left">
                          <input className={ "form-control" + ( errors.to ? ' alert-danger' : '' ) } onChange={() => this.handleSubmitRequestDebounced(true)}
                                 defaultValue={todayPlusFive} type="date" id="to" placeholder="YYYY-MM-DD"/>
                          { errors.to ? <span className="validation-error">{errors.to[1]}</span> : ""}
                      </div>
                  </div>
                  <div className="form-group row text-xs-center">
                      <label htmlFor="text" className="col-xs-3 col-sm-2 col-form-label text-xs-right">Description: </label>
                      <div className="col-xs-9 col-sm-10 text-xs-left">
                          <textarea className={ "form-control" + ( errors.text ? ' alert-danger' : '' ) } onChange={() => this.handleSubmitRequestDebounced(true)}
                                    type="text" id="text" rows="3" placeholder="Vysvětlete potenciálním hostitelům, proč jste právě vy ten pravý/á!"></textarea>
                          { errors.text ? <span className="validation-error">{errors.text[1]}</span> : ""}
                      </div>
                  </div>
              </form>
          </AbstractModal>
        );
    }
}
