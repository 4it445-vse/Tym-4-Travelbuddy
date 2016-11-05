import React, {Component} from 'react';

export class User extends Component {
    render() {
        const {buddy} = this.props;
        console.log("in User 2");
        console.log(buddy);
        return (
            <a href="" className="profil_vypis">
                <div className="card-block">
                    <div className="col-lg-2 col-md-2 col-sm-3 col-xs-5 col">
                        <img
                            src="https://pixabay.com/static/uploads/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                            alt="..." className="profil_img rounded"/>
                    </div>
                    <div className="col-lg-8 col-md-7 col-sm-5 col-xs-4 v-p-25">
                        <span className="v-o-25">{buddy.name + " " + buddy.surname}</span>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-4 col-xs-3 v-p-25">
                        <span className="v-o-25">Zobrazit profil</span>
                    </div>
                </div>
            </a>
        );
    }
}
