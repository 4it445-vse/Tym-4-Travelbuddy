import React, {Component} from "react";
import currentUser from "../../actions/CurrentUser";
import AbstractModal from "./AbstractModal";
import axios from "../../api";

export default class NewRequestModal extends Component {

  constructor(props) {
    super(props);
    this.handleSubmitEdit = this.handleSubmitRequest.bind(this);
  }

  handleSubmitRequest() {
    var city = document.getElementById("city").value;
    var from = document.getElementById("from").value;
    var to = document.getElementById("to").value;
    var text = document.getElementById("text").value;
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
          this.props.hideFn();
      });
    }
  }

  render() {
    const {showProp, hideFn} = this.props;
    const title = "Chci jet na novou cestu!";
    return (
      <AbstractModal title={title} showProp={showProp} hideFn={hideFn}
                     submitFn={this.handleSubmitEdit} submitText={"Uložit jízdu"}>
        <form>
          <div className="form-group row text-xs-center">
            <span>Pokud jedeš na novou cestu a nenašel si nikoho, kdo by hostoval ve tvém městě, napiš pro potencionální hostitele poptávku a vysvětli jim, proč by si měli vybrat právě tebe. Někdo se určitě najde a přijme tě za svého Buddyho!</span>
          </div>
          <hr/>
          <div className="form-group row text-xs-center">
            <label for="city" className="col-xs-3 col-sm-2 col-form-label text-xs-right">Město: </label>
            <div className="col-xs-9 col-sm-10">
              <input className="form-control" type="text" id="city" placeholder="Město, do kterého budete cestovat"/>
            </div>
          </div>
          <div className="form-group row text-xs-center">
            <label for="from" className="col-xs-2 col-form-label text-xs-right">Datum od:</label>
            <div className="col-xs-4">
              <input className="form-control" type="date" id="from" placeholder="YYYY-MM-DD"/>
            </div>
            <label for="to" className="col-xs-2 col-form-label text-xs-right">Datum do:</label>
            <div className="col-xs-4">
              <input className="form-control" type="date" id="to" placeholder="YYYY-MM-DD"/>
            </div>
          </div>
          <div className="form-group row text-xs-center">
            <label for="text" className="col-xs-3 col-sm-2 col-form-label text-xs-right">Popis: </label>
            <div className="col-xs-9 col-sm-10">
              <textarea className="form-control" type="text" id="text" rows="3" placeholder="Vysvětlete potenciálním hostitelům, proč jste právě vy ten pravý/á!"></textarea>
            </div>
          </div>
        </form>
      </AbstractModal>
    );
  }
}
