import React, {Component} from 'react';
import currentUser from '../../actions/CurrentUser.js';
import {TopNavigation} from '../TopNavigation/TopNavigation.js';

export class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buddy: props.buddy
        }
        this.openProfile = this.openProfile.bind(this);
    }

    openProfile() {
        if(!! currentUser.getCurrentUser()){
            this.props.openProfile(this.state.buddy);
            
        }else{
            alert("Nejdříve se musíš přihlásit");
        }
    }

    render() {
        return (
            <a href="#" onClick={this.openProfile} className="profil_vypis">
                <div className="card-block">
                    <div className="col-lg-2 col-md-2 col-sm-3 col-xs-5 col">
                        <img
                            src="http://images.megaupload.cz/mystery-man.png"
                            alt="..." className="profil_img rounded"/>
                    </div>
                    <div className="col-lg-8 col-md-7 col-sm-5 col-xs-4 v-p-25">
                        <span className="v-o-25">{this.state.buddy.name + " " + this.state.buddy.surname}</span>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-4 col-xs-3 v-p-25">
                        <span className="v-o-25">Zobrazit profil</span>
                    </div>
                </div>
            </a>
        );
    }
}
