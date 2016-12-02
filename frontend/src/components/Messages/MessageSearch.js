import React, {Component} from "react";

export default class MessageSearch extends Component {
	constructor(props){
		super(props);
		
		this.refreshUsersList = this.refreshUsersList.bind(this);
	}
	
	refreshUsersList(e){
		this.props.refreshUsersList(e.target.value);
	}
	
	
    render() {
        return (
			<div className="input-group">
				<input id="search-people" type="search"
					   className="form-control SearchBar SearchHeight SearchBorder bt2"
					   placeholder="Hledej jméno" onKeyUp={this.refreshUsersList}/>
				  <span className="input-group-btn">
						<button className="btn btn-defaul SearchButton SearchHeight text-white bt1" type="button">Hledej</button>
				  </span>
			</div>
        );
    }




}