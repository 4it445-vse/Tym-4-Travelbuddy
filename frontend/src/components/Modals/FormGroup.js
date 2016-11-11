import React, {Component} from 'react';

export default class FormGroup extends Component {
    render() {
        const {children} = this.props;
        return (
            <div className="form-group">
                {children}
            </div>
        );
    }
}