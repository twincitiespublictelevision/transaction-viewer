import React from 'react';
import { render } from 'react-dom';
import App from './App.jsx';

let transactionViewer = document.getElementById('root');

if (transactionViewer) {
  render(<App />, transactionViewer);
}

module.hot.accept();