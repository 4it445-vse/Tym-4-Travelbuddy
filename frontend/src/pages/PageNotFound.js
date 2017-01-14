import React, {Component} from 'react';

export default class PageNotFound extends Component {

    render() {
        document.body.style.backgroundImage = "url(https://static.pexels.com/photos/132037/pexels-photo-132037.jpeg)";
        return (
            <div>
                <h1 className="v-o-4">Page not found</h1>
            </div>
        );
    }
}
