import React, { Component } from 'react';
import { Link } from 'react-router';
import TopBar from './topbar';

class App extends Component {
  render() {
    return (
      <div>
        <TopBar />
        <div className="container-fluid">
          <br />
          {this.props.children}
        </div>        
      </div>
    );
  }
}

export default App;