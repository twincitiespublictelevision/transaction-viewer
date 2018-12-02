import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import 'react-dates/initialize';
import TransactionReport from './components/TransactionReport.jsx';
import styles from './style.css';
import { connector } from './store';

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
      calculations,
      config: { endpoints: { fields, profile, transactions }},
      reduce
    } = this.props;

    if (fields && profile && transactions) {
      return <TransactionReport calculations={calculations} reduce={reduce} />;
    } else {
      return null;
    }
  }
}

const TView = connector(TransactionViewerInner);

class TransactionViewer extends Component {
  render() {
    return (
      <Provider store={store}>
        <TView
          calculations={this.props.calculations || null}
          reduce={this.props.reduce || null}
          fieldsEndpoint={this.props.fieldsEndpoint}
          profileEndpoint={this.props.profileEndpoint}
          transactionsEndpoint={this.props.transactionsEndpoint}
        />
      </Provider>
    );
  }
}

export default TransactionViewer;