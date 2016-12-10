import React, {Component} from "react";
import currentUser from "../../actions/CurrentUser";
import FontAwesome from "react-fontawesome";

export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buddy: props.buddy
        }
        this.openProfile = this.openProfile.bind(this);
    }

    openProfile() {
        if (currentUser.getCurrentUser()) { //DONE removed !!
            this.props.openProfile(this.state.buddy);

        } else {
            currentUser.openLogIn();
        }
    }

    render() {
        return (
            <a href="#" onClick={this.openProfile} className="profil_vypis">
                <div className="card-block">
                    <div className="col-md-1 col-xs-3 no-margin no-padding">
                        <img src="http://images.megaupload.cz/mystery-man.png" alt={this.state.buddy.name + " " + this.state.buddy.surname} className="profil_img rounded"/>
                    </div>
                    <div className="col-md-3 col-xs-5">
                      <div className="row">
                        <p className="no-margin ellipsis">{this.state.buddy.name + " " + this.state.buddy.surname}</p>
                      </div>
                      <div className="row">
                        <span className="no-margin ellipsis">{this.state.buddy.city}</span>
                      </div>
                    </div>
                    <div className="col-md-1 col-xs-2">
                    {
                      this.state.buddy.sex === 'male' ?
                      <FontAwesome className="sexIcon" name="male" size="2x" style={{ color: '#0275d8' }}></FontAwesome> :
                      <FontAwesome className="sexIcon" name="female" size="2x" style={{ color: 'red' }}></FontAwesome>
                    }
                    </div>
                    <div className="col-md-6 hidden-sm-down">
                      <p className="no-margin ellipsis2">{this.state.buddy.about_me}</p>
                    </div>
                    <div className="col-md-1 col-xs-2">
                      <a href="/messages" className="profil_vypis">
                        <FontAwesome className="sexIcon" name="envelope" size="2x" style={{ color: '#0275d8' }}></FontAwesome>
                      </a>
                    </div>
                </div>
            </a>
        );
    }
}
