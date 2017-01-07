import './SuggestCity.css'
import React, {Component, PropTypes} from 'react'
import classNames from 'classnames'

export default class GooglePlacesSuggest extends Component {

    //TODO what is this
    static propTypes = {
        onSelectSuggest: PropTypes.func,
        search: PropTypes.string,
        suggestRadius: PropTypes.number,
    }

    //TODO what is this
    static defaultProps = {
        onSelectSuggest: () => {
        },
        search: '',
        suggestRadius: 20,
    }

    constructor(props) {
        super(props);
        this.state = {
            coordinate: null,
            googleMaps: window.google.maps,
            focusedSuggestIndex: 0,
            selectedLabel: '',
            suggests: [],
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.search !== nextProps.search) {
            this.updateSuggests(nextProps.search)
        }
    }

    handleSelectSuggest = (suggest) => {
        this.geocodeSuggest(suggest.label, () => {
            this.setState({selectedLabel: suggest.label, suggests: []}, () => {
                this.props.onSelectSuggest(suggest.label, this.state.coordinate, suggest.placeId);
            })
        })
    }

    updateSuggests(search) {
        const {suggestRadius} = this.props;
        const {googleMaps} = this.state;
        const autocompleteService = new googleMaps.places.AutocompleteService();

        if (!search) {
            this.setState({suggests: []});
            return
        }
        //TODO search should contain at least city and state placeId
        autocompleteService.getPlacePredictions({
            input: search,
            location: new googleMaps.LatLng(0, 0),
            radius: suggestRadius,
            types: ['(cities)']
        }, (googleSuggests) => {
            if (!googleSuggests) {
                this.setState({suggests: []});
                return
            }

            const suggests = googleSuggests.map((suggest, key) => {
                //TODO check what suggest containsX
                const [ label, ...items ] = suggest.terms;
                const address = items.map((item) => item.value).join(', ');
                const firstMatchedString = suggest.matched_substrings.shift();
                const cityNameWithState = label.value + " (" + address+")";
                return {
                    label: cityNameWithState,
                    labelParts: {
                        before: label.value.substr(0, firstMatchedString.offset),
                        matched: label.value.substr(firstMatchedString.offset, firstMatchedString.length),
                        after: label.value.substr(firstMatchedString.offset + firstMatchedString.length),
                    },
                    address: address,
                    placeId: suggest.place_id
                }
            });

            this.setState({focusedSuggestIndex: 0, suggests})
        })
    }

    geocodeSuggest(suggestLabel, callback) {
        const {googleMaps} = this.state;
        const geocoder = new googleMaps.Geocoder();

        //TODO advance this to longitude & latitude, or at least city + state
        geocoder.geocode({address: suggestLabel}, (results, status) => {
            if (status === googleMaps.GeocoderStatus.OK) {
                //TODO check location whether it contains state, if so than pass it to coordinates, place_id
                const location = results[0].geometry.location;
                const coordinate = {
                    latitude: location.lat(),
                    longitude: location.lng(),
                    title: suggestLabel,
                }

                this.setState({coordinate}, callback)
            }
        })
    }

    handleKeyDown = (e) => {
        const {focusedSuggestIndex, suggests} = this.state;

        switch (e.key) {
            case 'Enter':
                this.handleSelectSuggest(suggests[focusedSuggestIndex]);
                break;

            case 'ArrowUp':
                if (suggests.length > 0 && focusedSuggestIndex > 0) {
                    this.setState({focusedSuggestIndex: focusedSuggestIndex - 1});
                }
                break;

            case 'ArrowDown':
                if (suggests.length > 0 && focusedSuggestIndex < suggests.length - 1) {
                    this.setState({focusedSuggestIndex: focusedSuggestIndex + 1});
                }
                break;

            case 'Escape':
                this.setState({suggests: []});
                break;

            case 'Tab':
                this.handleSelectSuggest(suggests[focusedSuggestIndex]);
                break;
        }
    }

    renderSuggest(suggest, key) {
        const {focusedSuggestIndex} = this.state;
        const {labelParts} = suggest;

        return (
            <li
                key={ key }
                className={ classNames('placesSuggest_suggest', focusedSuggestIndex === key && 'placesSuggest_suggest-active') }
                onClick={ () => this.handleSelectSuggest(suggest) }>
        <span className="placesSuggest_suggestLabel">
          { labelParts.before.length > 0 ? <span>{ labelParts.before }</span> : null }
            <span className="placesSuggest_suggestLabel-matched">{ labelParts.matched }</span>
            { labelParts.after.length > 0 ? <span>{ labelParts.after }</span> : null }
        </span>
                <span className="placesSuggest_suggestAddress">{ suggest.address }</span>
            </li>
        )
    }

    renderSuggests() {
        const {suggests} = this.state;

        return (
            <ul className="placesSuggest_suggests">
                { suggests.map((suggest, key) => this.renderSuggest(suggest, key)) }
            </ul>
        )
    }

    render() {
        const {search, display} = this.props;
        const {selectedLabel} = this.state;
        return (
            <div className="placesSuggest" onKeyDown={ this.handleKeyDown }>
                { this.props.children }
                { selectedLabel !== search && search && display ? this.renderSuggests() : null }
            </div>
        )
    }
}
