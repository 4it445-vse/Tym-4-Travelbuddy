import React, { Component } from 'react';

import { PageFooter } from '../components/PageFooter/PageFooter';
import TopNavigation from '../components/TopNavigation/TopNavigation';

export class AppPage extends Component {
  render() {
    const { children } = this.props;
    return (
      <div>
        <TopNavigation/>
        <div className="container">
          {children}
        </div>
        <PageFooter/>
      </div>
    );
  }
}
