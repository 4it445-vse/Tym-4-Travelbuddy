import React, {Component} from "react";

export default class MessageSearch extends Component {
	
	refreshUsersList = (e) => {
		this.props.refreshUsersList(e.target.value);
	}
	
	
    render() {
        return (
			<div className="input-group">
				<input id="search-people" type="search"
					   className="form-control SearchBar SearchHeight SearchBorder bt2"
					   placeholder="Search buddy" onKeyUp={this.refreshUsersList}/>
				  <span className="input-group-btn">
						<button className="btn btn-defaul SearchButton SearchHeight text-white bt1" type="button">Search</button>
				  </span>
			</div>
        );
    }




}