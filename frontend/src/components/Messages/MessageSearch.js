import React, {Component} from "react";

export default class MessageSearch extends Component {
    render() {
		const { refreshUsersList } = this.props;
        return (
			<div className="input-group">
				<input id="search-people" type="search"
					   className="form-control SearchBar SearchHeight SearchBorder bt2"
					   placeholder="Hledej jméno" onKeyUp={refreshUsersList}/>
				  <span className="input-group-btn">
						<button className="btn btn-defaul SearchButton SearchHeight text-white bt1" type="button" onClick={refreshUsersList}>Hledej</button>
				  </span>
			</div>
        );
    }




}