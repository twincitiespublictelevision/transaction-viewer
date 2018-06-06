// @flow

import React, { Component } from 'react';
import { connector } from '../store';
import { sortGen } from '../sort';
import type { Action } from '../actions/actions';

export class TransactionTable extends Component<*, *> {
  state: {
    page: number,
    pageOptions: Array<number>,
    sort: {
      by: string,
      asc: boolean
    }
  };

  // Work around as the type of props is not actually known as it can be
  // extended arbitrarily by Redux
  constructor(props: any) {
    super(props);

    // Table manages its own sorting and pagination state
    this.state = {
      page: 1,
      pageOptions: [0, 5, 10, 25, 50, 100],
      sort: {
        by: 'timestamp',
        asc: false
      }
    }
  }

  updatePage(event: SyntheticInputEvent<HTMLInputElement>) {
    this.setState({
      page: parseInt(event.target.value)
    });
  }

  updatePerPage(action: (number) => Action) {
    return function(event: SyntheticInputEvent<HTMLInputElement>) {
      action(parseInt(event.target.value))
    };
  }

  updateSort(key: string, isAsc: boolean): () => void {
    return function() {
      this.setState({
        sort: {
          by: key,
          asc: isAsc
        }
      });
    }.bind(this);
  }

  render() {

    // Assignment to avoid bind calls
    let props = this.props;
    let state = this.state;
    let maxPages = Math.max(1, Math.ceil(props.data.length /  props.rowsPerPage));

    // Generate a sort comparator based on the currently defined ordering
    let comp = sortGen(state.sort.asc);

    let sortArrow = state.sort.asc ? <span className="transaction-sort-asc">&nbsp;</span> :
      <span className="transaction-sort-desc">&nbsp;</span>;

    // Clone the data and sort it based on the generated comparator
    let dataSet = props.data.slice().sort((a, b) => { return comp(a[state.sort.by], b[state.sort.by]); });

    // Once the data is sorted, the data set can be sliced down to the defined
    // page size and page number
    let dataView = dataSet.slice(
      (state.page - 1) * props.rowsPerPage,
      state.page * props.rowsPerPage
    );

    let dimensions = props.dimensions.filter(function(dimension){
      return dimension.hide.indexOf('table') === -1;
    });

    return (
      <div className="transaction-records">
        <div className="transaction-records-per-page">
          <label className="per-page-control">
            <span>Show </span>
            <select onChange={this.updatePerPage(props.changeRowsPerPage)} value={props.rowsPerPage}>
              {state.pageOptions.map((opt, index) => <option key={index} value={opt}>{opt}</option>)}
            </select>
            <span> entries per page</span>
          </label>
        </div>
        <div className="transaction-records-pagination">
          <label className="page-control">
            <span>Page </span>
            <input className="page-control-slider" type="range" min="1" max={maxPages} value={state.page} onChange={this.updatePage.bind(this)} />
            <span className="page-control-current">{state.page}</span>
          </label>
        </div>
        <table>
          <tbody>
            <tr>
              {
                dimensions.map(
                  function(dim, index) {
                    return (

                      // Handle toggling between ascending and descending sorting
                      // if the current dimension is the defined sort dimension
                      <th key={index} onClick={this.updateSort(dim.value, dim.value === state.sort.by ? !state.sort.asc : false)}>
                        {dim.title} {dim.value === state.sort.by ? sortArrow : ''}
                      </th>
                    );
                  }.bind(this)
                )
              }
            </tr>
            {
              dataView.map((row, index) => {
                return (
                  <tr key={index}>
                    {dimensions.map((dim, index) => <td key={index}>{row[dim.value]}</td>)}
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default connector(TransactionTable);