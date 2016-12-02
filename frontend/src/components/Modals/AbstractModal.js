import React, {Component} from "react";
import {Modal} from "react-bootstrap";

export default class AbstractModal extends Component {
    render() {
        const {title, showProp, hideFn, submitFn, submitText, children} = this.props;
        return (
            <Modal show={showProp} onHide={hideFn}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {children}
                </Modal.Body>
                <Modal.Footer>
                    <div className="form-check">
                        <button onClick={submitFn} type="button"
                                className="btn btn-primary fullsize">{submitText}
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>);
    }
}
