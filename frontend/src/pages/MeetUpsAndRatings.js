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
    };;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

    render() {
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
                        <Tab>Buddy</Tab>
                        <Tab>Traveller</Tab>
                    </TabList>
                    <TabPanel>
                        <MeetUps meetUps={this.state.meetUps} isBuddyView={this.state.isBuddyView}/>
                    </TabPanel>
                    <TabPanel>
                        <MeetUps meetUps={this.state.meetUps} isBuddyView={this.state.isBuddyView}/>
                    </TabPanel>
                </Tabs>
            </div>
            </div>
        );
    }
}
export default connect(
    (state) => ({
        user: state.user
    })
)(MeetUpsAndRatings);