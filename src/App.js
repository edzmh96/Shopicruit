import React, { Component } from 'react';
import './App.css';

// 6 pages
var App = React.createClass({
  render: function() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Shopify Watch/Clock Cost Counter</h2>
          <h2> by Edward Zhou </h2>
        </div>
        <p className="App-intro">
          Cost to buy all the watches/clocks in the store:
        </p>
      </div>
    );
  }
});

export default App;
