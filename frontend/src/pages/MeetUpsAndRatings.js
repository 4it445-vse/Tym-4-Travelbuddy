import React, {Component} from "react";
import MeetUps from "../components/MeetUps/MeetUps";
import axios from "../api";
import {connect} from "react-redux";
import {Tab, Tabs, TabList, TabPanel} from "react-tabs";

class MeetUpsAndRatings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meetUps: [],
            isBuddyView: true
        };
    }

    componentDidMount() {
        this.handleSelect(0);
    }

    refresh = () => {
        this.handleSelect(this.state.isBuddyView ? 0 : 1);
    }

    handleSelect = (index) => {
        let where = {};
        let isBuddyView;
        if(index === 0){
            where['buddy_id_to'] = this.props.user.id;
            isBuddyView = true;
        }else{
            where['buddy_id_from'] = this.props.user.id;
            isBuddyView = false;
        }
        axios.get('Meetups', {
            params: {
                filter: {
                    include: 'ratings',
                    where
                }
            }
        }).then(response => {
            this.setState({
                meetUps: response.data,
                isBuddyView: isBuddyView
            });
        }, error => {
            console.log("error: ", error);
        });
    };

    render() {
        console.log("in meetups: ", this.props.requestNotification);
        return (
            <div>
        <div className="row pad-t-5 colarose">
            <div className="container white">
                <h1 className="v-o-4">Meet ups</h1>
            </div>
        </div>
                <div className="container m-t-10">
                <Tabs onSelect={this.handleSelect}>
                    <TabList>
                        <Tab>Buddy{this.props.requestNotification.countBuddy > 0 ? <span className="label label-success margin-left-5">{this.props.requestNotification.countBuddy}</span> : ""}</Tab>
                        <Tab>Traveller{this.props.requestNotification.countTraveller > 0 ? <span className="label label-success margin-left-5">{this.props.requestNotification.countTraveller}</span> : ""}</Tab>
                    </TabList>
                    <TabPanel>
                        <MeetUps meetUps={this.state.meetUps} isBuddyView={this.state.isBuddyView} refresh={this.refresh}/>
                    </TabPanel>
                    <TabPanel>
                        <MeetUps meetUps={this.state.meetUps} isBuddyView={this.state.isBuddyView} refresh={this.refresh}/>
                    </TabPanel>
                </Tabs>
            </div>
            </div>
        );
    }
}
export default connect(
    (state) => ({
        user: state.user,
        requestNotification: state.requestNotification
    })
)(MeetUpsAndRatings);