import React, {Component} from "react";
import FindUser from "../components/Search/FindUser";
import SearchForm from "../components/Search/SearchForm";
import FontAwesome from "react-fontawesome";
import axios from "../api";
import currentUser from "../actions/CurrentUser";

export class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchedTown: '',
            setSearchedTown: this.setSearchedTown.bind(this),
            budies: []
        };

        this.setSearchedTown = this.setSearchedTown.bind(this);
        this.findRelevantBuddies = this.findRelevantBuddies.bind(this);
        this.findAllBuddies = this.findAllBuddies.bind(this);
    }

    componentDidMount() {
        this.findAllBuddies();
    }

    findAllBuddies() {
        axios.get('buddies', {
            params: {
                filter: {
                    where: {
                        is_hosting: true
                    }
                }
            }
        }).then(response => {
            this.setState({
                budies: response.data,
            });
        });
    }

    findRelevantBuddies() {
        axios.get('buddies', {
            params: {
                filter: {
                    where: {
                        city: {like: `%${this.state.searchedTown}%`},
                        is_hosting: true
                    },
                },
            }
        }).then(response => {
            this.setState({
                budies: response.data,
            });
        });
    }

    setSearchedTown(value) {
        if (value) {
            this.setState({searchedTown: value}, () => {
                this.findRelevantBuddies()
            });
        } else {
            this.findAllBuddies();
        }

    }

    render() {
        return (
            <div>
              <h1 className="v-o-4">Buddies</h1>
                {
                    !!currentUser.getCurrentUser() ?
                        <div>
                            <SearchForm setSearchedTown={this.state.setSearchedTown}/>
                        </div>
                        :
                        <div>
                          <div className="row text-xs-center v-o-4">
                              <div className="col-xs-4">
                                  <div className="iconContainer">
                                      <div className="row">
                                          <FontAwesome className="bigIcons" name="user"></FontAwesome>
                                      </div>
                                      <div className="row heading-container">
                                          <h5 className="hidden-sm-down">Traveling Alone</h5>
                                          <h6 className="hidden-md-up">Traveling Alone</h6>
                                      </div>
                                      <FontAwesome className="iconsColor hidden-sm-down" name="arrow-right"
                                                   size="2x"></FontAwesome>
                                      <FontAwesome className="iconsColor hidden-md-up" name="arrow-right"></FontAwesome>
                                  </div>
                              </div>
                              <div className="col-xs-4">
                                  <div className="iconContainer">
                                      <div className="row">
                                          <FontAwesome className="bigIcons" name="user-plus"></FontAwesome>
                                      </div>
                                      <div className="row heading-container">
                                          <h5 className="hidden-sm-down">Register and Login</h5>
                                          <h6 className="hidden-md-up">Register and Login</h6>
                                      </div>
                                      <FontAwesome className="iconsColor hidden-sm-down" name="arrow-right"
                                                   size="2x"></FontAwesome>
                                      <FontAwesome className="iconsColor hidden-md-up" name="arrow-right"></FontAwesome>
                                  </div>
                              </div>
                              <div className="col-xs-4">
                                  <div className="iconContainer">
                                      <div className="row">
                                          <FontAwesome className="bigIcons" name="users"></FontAwesome>
                                      </div>
                                      <div className="row heading-container">
                                          <h5 className="hidden-sm-down">Find Buddies</h5>
                                          <h6 className="hidden-md-up">Find Buddies</h6>
                                      </div>
                                      <FontAwesome className="iconsColor hidden-sm-down" name="thumbs-up" size="2x"></FontAwesome>
                                      <FontAwesome className="iconsColor hidden-md-up" name="thumbs-up"></FontAwesome>
                                  </div>
                              </div>
                          </div>
                          <div className="row text-xs-center main-info">
                              <p className="hidden-md-up"><b>We would like to welcome you on the TravelBuddy page.</b>
                              </p>
                              <p className="hidden-sm-down"><b>We would like to welcome you on the TravelBuddy page.
                                  By
                                  using TravelBuddy you can quickly get from traveling alone to best vacation in your
                                  live
                                  by meeting new friends and buddies in your destination. </b></p>
                          </div>
                          <SearchForm setSearchedTown={this.state.setSearchedTown}/>
                        </div>
                }

                <FindUser budies={this.state.budies} searchedTown={this.state.searchedTown}/>
            </div>
        );
    }
}
