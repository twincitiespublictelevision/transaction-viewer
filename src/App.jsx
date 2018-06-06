import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import 'react-dates/initialize';
import TransactionReport from './components/TransactionReport.jsx';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <TransactionReport/>
      </Provider>
    );
  }
}

export default App;