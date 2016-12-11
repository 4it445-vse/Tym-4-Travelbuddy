import React, {Component} from "react";
import User from "./User";

export default class FindUser extends Component {

    constructor(props) {
        super(props);
        this.paginationButton = "btn btn-defaul text-white PaginateButtonVisible PaginateButton:hover PaginateButton";
        this.pageSize = 5;
        this.state = {
            showProfileModal: false,
            buddy: {},
            activeBulk:0,
            lastBulk: 0,
            startIndex: 0,
            endIndex:0,
            prevButtonVisible: false,
            nextButtonVisible: false
        };

        this.renderNextPage = this.renderNextPage.bind(this);
        this.renderPreviousPage = this.renderPreviousPage.bind(this);
    }

    componentWillReceiveProps(nextProps){

      if(nextProps.budies.length <= this.pageSize){
        this.setState({
          showProfileModal: false,
          buddy: {},
          activeBulk:0,
          startIndex:0,
          endIndex: nextProps.budies.length,
          lastBulk: 0,
          prevButtonVisible: false,
          nextButtonVisible: false,
        });
      }
      else {
        this.setState({
          showProfileModal: false,
          buddy: {},
          activeBulk:0,
          startIndex:0,
          endIndex: this.pageSize,
          lastBulk: (nextProps.budies.length % this.pageSize) === 0 ? Math.floor(nextProps.budies.length/this.pageSize) - 1 : Math.floor(nextProps.budies.length/this.pageSize),
          prevButtonVisible: false,
          nextButtonVisible: true,
        });
      }

    }

    renderNextPage(){
      this.setState((prevState, props) => {
        return {
          showProfileModal: false,
          buddy: {},
          activeBulk: prevState.activeBulk + 1,
          startIndex: prevState.endIndex,
          endIndex: prevState.endIndex + this.pageSize,
          prevButtonVisible: true,
          nextButtonVisible: (prevState.activeBulk + 1) === prevState.lastBulk ? false : true
        };
      });
    }

    renderPreviousPage(){
      this.setState((prevState, props) => {
        return {
          showProfileModal: false,
          buddy: {},
          activeBulk: prevState.activeBulk - 1,
          startIndex: (prevState.startIndex - this.pageSize) < 0 ? 0 : prevState.startIndex - this.pageSize,
          endIndex: prevState.startIndex,
          prevButtonVisible: (prevState.activeBulk - 1) === 0 ? false : true,
          nextButtonVisible: true
        };
      });
    }


    render() {
        const {budies} = this.props;
        return (

            <div>
                {
                    budies.length === 0 ?
                        <div className="row">

                        </div> :


                        <div className="row">
                            <div className="card v-o-25">
                                <div className="card-block">
                                    <h4 className="card-title">TravelBuddy found {budies.length} {budies.length === 1 ? "user" : "users"} for you.</h4>
                                </div>
                                {
                                    budies.slice(this.state.startIndex, this.state.endIndex).map(buddy =>
                                        <User buddy={buddy} key={buddy.id}/>
                                    )
                                }
                                <div className="card-block PaginateRibbon">
                                    {
                                        this.state.prevButtonVisible &&
                                        <button className={this.paginationButton} type="button"
                                                onClick={this.renderPreviousPage}>
                                            Previous
                                        </button>
                                    }
                                    {
                                        this.state.nextButtonVisible &&
                                        <button className={this.paginationButton} type="button"
                                                onClick={this.renderNextPage}>
                                            Next
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                }
                </div>
        );
    }
}
