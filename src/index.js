import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import CostBuilder from './CostBuilder'
import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
ReactDOM.render(
  <CostBuilder />,
  document.getElementById('content')
)
