import React, {Component} from "react";
import SearchForm from "../components/Search/SearchForm";
import { RequestsList } from '../components/Requests/RequestsList.js';
import lodash from 'lodash';
import axios from "../api";

export class RequestsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: null,
    };

    this.fetchRequestsDebounced = lodash.debounce(this.fetchRequests, 500);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleSearchChange(event) {
    const searchString  = event.target.value;
    this.fetchRequestsDebounced(searchString);
  }

  paramsForSerchString(searchString) {
    if (!searchString) { return {}; }
    return { filter: { where: { city: { like: `%${searchString}%` }, }, },}
  }

  fetchRequests(searchString) {
    axios.get('Requests', { params: this.paramsForSerchString(searchString) })
      .then((response) => {
        this.setState({ requests: response.data });
      });
  }

  componentDidMount() {
    this.fetchRequests();
  }

  render() {
    const { requests } = this.state;

    return (
      <div>
        <div className="row">
          <div className="input-group v-o-5">
            <input id="search-town" type="search" className="form-control SearchBar SearchHeight SearchBorder"
                   placeholder="Zadej cílové město" onChange={this.handleSearchChange}/>
            <span className="input-group-btn">
              <button className="btn btn-defaul SearchButton SearchHeight text-white" type="button"
                      onClick={this.handleSearchChange}>
                  <i className="fa fa-search SearchIcon" aria-hidden="true"></i> Hledej
              </button>
            </span>
            </div>
        </div>
        {requests === null ?
          <div>Načítání jízd...</div> :
          <RequestsList requests={requests}/>
        }
      </div>
    );
  }
}
