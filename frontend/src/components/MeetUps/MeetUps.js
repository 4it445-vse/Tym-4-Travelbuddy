import React, {Component} from "react";
import MeetUp from "./MeetUp";
import LazyLoad from "react-lazyload";
import Loading from "../Images/Loading";

export default class MeetUps extends Component {

    constructor(props) {
        super(props);
        this.pageSize = 5;
        this.state = {

        };
    }

    renderMeetUps(){
      const {meetUps} = this.props;
      const placeholder = (<div className="card-block text-xs-center"><Loading/></div>);
      var render = [];
      for(var i = 0; i < meetUps.length; i++) {
          if(this.props.isBuddyView === true){
              render.push(<LazyLoad placeholder={placeholder} key={meetUps[i].id} height="50px" ><MeetUp  buddyId={meetUps[i].buddy_id_from} meetUp={meetUps[i]} isBuddyView={this.props.isBuddyView} refresh={this.props.refresh}/></LazyLoad>)
          }else{
              render.push(<LazyLoad placeholder={placeholder} key={meetUps[i].id} height="50px" ><MeetUp  buddyId={meetUps[i].buddy_id_to} meetUp={meetUps[i]} isBuddyView={this.props.isBuddyView} refresh={this.props.refresh}/></LazyLoad>)
          }
      }
      return render;
    }

    render() {
        const {meetUps} = this.props;
        return (

            <div>
                {
                    meetUps.length === 0 ?
                       (<h1 className="noRequestsFound">No Meet Up record has been found.</h1>) :


                        <div className="row">
                            <div className="card">
                                <div className="card-block">
                                    <h4 className="card-title">{meetUps.length} {meetUps.length === 1 ? "meet up" : "meet ups"} found.</h4>
                                </div>
                                {
                                    this.renderMeetUps()
                                }
                              
                            </div>
                        </div>
                }
            </div>
        );
    }
}
