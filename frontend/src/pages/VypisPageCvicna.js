import React, {Component} from "react";
//import { Link } from 'react-router';

export class VypisPage extends Component {
    render() {
        return (

            <div className="row">
                <div className="card v-o-5">
                    <div className="card-block">
                        <h4 className="card-title">Pro město X bylo nalezeno X uživatelů</h4>
                    </div>

                    <a href="" className="profil_vypis">
                        <div className="card-block">
                            <div className="col-lg-2 col-md-2 col-sm-3 col-xs-5 col">
                                <img src="ss.jpeg" alt="..." className="profil_img rounded"/>
                            </div>
                            <div className="col-lg-8 col-md-7 col-sm-5 col-xs-4 v-p-25">
                                <span className="v-o-25">Pavel Němec</span>
                            </div>
                            <div className="col-lg-2 col-md-3 col-sm-4 col-xs-3 v-p-25">
                                <span className="v-o-25">Zobrazit profil</span>
                            </div>
                        </div>
                    </a>

                    <a href="" className="profil_vypis">
                        <div className="card-block">
                            <div className="col-lg-2 col-md-2 col-sm-3 col-xs-5 col">
                                <img src="ss.jpeg" alt="..." className="profil_img rounded"/>
                            </div>
                            <div className="col-lg-8 col-md-7 col-sm-5 col-xs-4 v-p-25">
                                <span className="v-o-25">Pavel Němec</span>
                            </div>
                            <div className="col-lg-2 col-md-3 col-sm-4 col-xs-3 v-p-25">
                                <span className="v-o-25">Zobrazit profil</span>
                            </div>
                        </div>
                    </a>


                </div>
            </div>
        );
    }
}