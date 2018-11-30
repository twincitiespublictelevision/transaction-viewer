import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import 'react-dates/initialize';
import TransactionReport from './components/TransactionReport.jsx';
import styles from './style.css';

class TransactionViewerInner extends Component {
  componentDidMount() {
    this.props.setConfig({
      endpoints: {
        fields: this.props.fieldsEndpoint || '',
        profile: this.props.profileEndpoint || '',
        transactions: this.props.transactionsEndpoint || ''
      }
    })
  }

  render() {
    let {
      config: { endpoints: { fields, profile, transactions }}
    } = this.props;

    if (fields && profile && transactions) {
      return <TransactionReport />;
    } else {
      return null;
    }
  }
}

class TransactionViewer extends Component {
  render() {
    return (
      <Provider store={store}>
        <TransactionViewerInner
          fieldsEndpoint={this.props.fieldsEndpoint}
          profileEndpoint={this.props.profileEndpoint}
          transactionsEndpoint={this.props.transactionsEndpoint}
        />
      </Provider>
    );
  }
}

export default TransactionViewer;