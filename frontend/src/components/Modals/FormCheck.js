import React, {Component} from 'react';

export default class FormCheck extends Component {
    render() {
        const {children} = this.props;
        return (
            <div className="form-check">
                {children}
            </div>
        );
    }
}