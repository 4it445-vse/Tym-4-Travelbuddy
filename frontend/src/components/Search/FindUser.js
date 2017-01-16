import React, {Component} from "react";
import User from "./User";
import LazyLoad from 'react-lazyload';

export default class FindUser extends Component {

    constructor(props) {
        super(props);
        this.pageSize = 5;
        this.state = {
            showProfileModal: false,
            buddy: {}
        };
    }

    renderBuddies = () => {
      const {budies} = this.props
      const loader = require('../../images/lazyload.gif');
      const placeholder = (<div className="card-block text-xs-center" id="buddy-row"><img src={loader}/></div>)
      var render = []
      for(var i = 0; i < budies.length; i++) {
        render.push(<LazyLoad placeholder={placeholder} key={budies[i].id} height="50px" ><User  buddyId={budies[i].id}/></LazyLoad>)
      }
      return render
    }

    render() {
        const {budies} = this.props;
        return (

            <div>
                {
                    budies.length === 0 ?
                       (<h1 className="noRequestsFound">Sorry. No buddies found for this city</h1>) :


                        <div className="row">
                            <div className="card v-o-25">
                                <div className="card-block">
                                    <h4 className="card-title">TravelBuddy found {budies.length} {budies.length === 1 ? "user" : "users"} for you.</h4>
                                </div>
                                {
                                    this.renderBuddies()
                                }
                              
                            </div>
                        </div>
                }
            </div>
        );
    }
}
