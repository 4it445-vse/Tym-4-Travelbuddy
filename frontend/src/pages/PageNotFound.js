import React, {Component} from 'react';

export default class PageNotFound extends Component {

    render() {
        document.body.style.backgroundImage = "url(https://static.pexels.com/photos/132037/pexels-photo-132037.jpeg)";
        return (
            <div className="row pad-t-5 colarose">
                <div className="container white">
                    <h1 className="v-o-4"><img src="http://icons.iconarchive.com/icons/double-j-design/ravenna-3d/256/Error-icon.png" role="presentation" width="5%"/> Error 404 Page not Found</h1>
                    <h1>Maybe you used bad link. You can back to <a href="/" className="odkaz">Homepage</a></h1>
                </div>
            </div>
        );
    }
}
