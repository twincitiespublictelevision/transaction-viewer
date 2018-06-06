// @flow

import React, { Component } from 'react';
import { connector } from '../store';
import type {Action} from '../actions/actions';

export class Filter extends Component<*, *> {
  props: {
    removeFilter: (number) => Action,
    typeLabel: string,
    value: string,
    index: number
  };

  deleteFilter(action: (number) => Action) {
    return function() {
      action(this.props.index);
    }.bind(this);
  }

  render() {
    return (
      <li className="transaction-filter">
        <span className="transaction-filter-label">
          <span className="transaction-filter-label-type">
            {this.props.typeLabel}
          </span> : {this.props.value}
        </span>
        <span className="transaction-filter-delete" onClick={this.deleteFilter(this.props.removeFilter)}>x</span>
      </li>
    );
  }
}

export default connector(Filter);