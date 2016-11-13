import React, {Component} from "react";
import {Modal} from "react-bootstrap";
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

        this.openProfile = this.openProfile.bind(this);
        this.closeProfile = this.closeProfile.bind(this);
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


    openProfile(buddy) {
        this.setState({
            showProfileModal: true,
            buddy: buddy
        });
    }

    closeProfile() {
        this.setState({showProfileModal: false});
    }

    render() {
        const {budies} = this.props;
        const {buddy} = this.state;
        return (

            <div>
                <Modal show={this.state.showProfileModal} onHide={this.closeProfile}>
                    <Modal.Header closeButton>
                        <Modal.Title>{buddy.name + " " + buddy.surname}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            Pohlaví:
                            {buddy.sex === 'male' ? "muž" : "žena"}
                            <br/>
                            {"Město: " + buddy.city}
                            <br/>
                            Hostuji:
                            {buddy.is_hosting ? "ano" : "ne"}
                            <br/>
                            {"Email: " + buddy.email}
                            <br/>
                            {"O mě: " + buddy.about_me}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
                <div className="row">
                    <div className="card v-o-5">
                        <div className="card-block">
                            <h4 className="card-title">Bylo
                                nalezeno {budies.length} {budies.length === 1 ? "uživatel" : "uživatelů"}</h4>
                        </div>
                        {
                            budies.slice(this.state.startIndex,this.state.endIndex).map(buddy =>
                                <User buddy={buddy} key={buddy.id} openProfile={this.openProfile}/>
                            )
                        }
                        <div className="card-block PaginateRibbon">
                          {
                            this.state.prevButtonVisible && <button className={this.paginationButton} type="button"
                                  onClick={this.renderPreviousPage}>
                              Předchozí
                            </button>
                          }
                          {
                            this.state.nextButtonVisible && <button className={this.paginationButton} type="button"
                                  onClick={this.renderNextPage}>
                              Další
                            </button>
                          }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
