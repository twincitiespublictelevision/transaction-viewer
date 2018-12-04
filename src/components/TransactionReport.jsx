import axios from 'axios';
import React, { Component } from 'react';
import { connector, generateFilterFn } from '../store';
import DateManager from "./DateManager.jsx";
import FilterManager from './FilterManager.jsx';
import TransactionTable from './TransactionTable.jsx';
import TransactionTotals from './TransactionTotals.jsx';
import TimeRangePicker from './TimeRangePicker.jsx';
import uuid from 'uuid/v4';
import ReactPivot from 'react-pivot';

let calculations = [
  { title: '#Plg', value: 'count',
    template: function(val) {
      return val;
    }
  },
  { title: '#Charges', value: 'creditcard',
    template: function(val) {
      return val;
    }
  },
  { title: '#PayPal', value: 'paypal',
    template: function(val) {
      return val;
    }
  },
  { title: '#EFT', value: 'eft',
    template: function(val) {
      return val;
    }
  },
  { title: 'Total:Annual', value: 'total',
    template: function(val) {
      return '$' + val.toFixed(2);
    }
  },
  { title: 'Total:Monthly', value: 'monthtotal',
    template: function(val) {
      return '$' + val.toFixed(2);
    }
  },
  { title: '#Monthly', value: 'monthcount',
    template: function(val) {
      return val;
    }
  },
  { title: 'Total:One Time', value: 'onetimetotal',
    template: function(val) {
      return '$' + val.toFixed(2);
    }
  },
  { title: '#One Time', value: 'onetimecount',
    template: function(val) {
      return val;
    }
  },
  { title: 'Average', value: 'total',
    template: function(val, row) {
      return '$' + (row.total / row.count).toFixed(2);
    }
  },
  { title: 'Max', value: 'max',
    template: function(val) {
      return '$' + val.toFixed(2);
    }
  }
];

/**
 * Reduce is a function used by react-pivot to compute additional data not
 * initially present in the data set
 *
 * @param {Object} row
 * @param {Object} memo
 * @returns {Object}
 */
let reduce = function reduce(row, memo) {
  function isApproved(val) {
    return row.approved === 'Yes' ? val : 0;
  }

  // Add a row total (annual)
  memo.total = (memo.total || 0) + isApproved(parseFloat(row.one_time || row.monthly * 12));

  // Add a month total
  memo.monthtotal = (memo.monthtotal || 0) + isApproved((parseFloat(row.monthly) || 0));

  // Add a month count
  memo.monthcount = (memo.monthcount || 0) + isApproved((parseFloat(row.monthly) ? 1 : 0));

  // Add a month total
  memo.onetimetotal = (memo.onetimetotal || 0) + isApproved((parseFloat(row.one_time) || 0));

  // Add a one time count
  memo.onetimecount = (memo.onetimecount || 0) + isApproved((parseFloat(row.one_time) ? 1 : 0));

  // Add a record count
  memo.count = (memo.count || 0) + isApproved(1);

  // Add a record max
  memo.max = Math.max(memo.max || 0, isApproved(parseFloat(row.one_time || row.monthly * 12)));

  memo.creditcard = (memo.creditcard || 0) + isApproved((row.payment_method === 'Credit' ? 1 : 0));
  memo.paypal = (memo.paypal || 0) + isApproved((row.payment_method === 'Paypal' ? 1 : 0));
  memo.eft = (memo.eft || 0) + isApproved((row.payment_method === 'EFT' ? 1 : 0));

  return memo;
};

/**
 * A reference to a pivot table
 *
 * @param {Object} ref
 */
let pivotRefToProps = function serializePivot(ref) {

  // Serialize the ref state into a storable form
  let storable = {};

  ['dimensions', 'sortBy', 'sortDir', 'hiddenColumns', 'solo'].forEach(function(key) {
    storable[key] = ref.state[key];
  });

  return storable;
};

class TransactionReport extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pivots: {},
      pivotPageSizes: [5,10,25,50,100],
      defaultPivotPageSize: 25,
      updateInterval: null,
      rate: 30000,
      saveInterval: null
    };
  }

  componentDidMount() {

    // When the App starts up, perform an initial data request then
    // boot the data refresher
    this.props.loadFields();
    this.props.fetchData();
    this.props.loadProfile().then(() => {
      this.setState(() => {
        return {
          saveInterval: setInterval(
            function() {
              this.storeState();
            }.bind(this),
            10000
          )
        }
      })
    });
  }

  componentWillReceiveProps() {
    let props = this.props;

    // Determine a rate for which to refresh the dataset
    let rate = 30000;

    // A faster refresh rate is only needed when the end date is in the future
    if (props.endDate.valueOf() > Date.now()) {
      rate = this.computeRefreshFrequency(Date.now() - Math.min(Date.now(), props.startDate.valueOf()));
    }

    if (rate !== this.state.rate) {
      clearInterval(this.state.updateInterval);

      let intervalId = setInterval(
        function() {
          props.fetchData();
        },
        rate
      );

      this.setState({
        rate: rate,
        updateInterval: intervalId
      });
    }
  }

  updatePivotRef(uuid, ref) {
    if (!this.state.pivots[uuid]) {
      let newPivotState = this.state.pivots;
      newPivotState[uuid] = ref;

      this.setState({
        pivots: newPivotState
      });
    }
  }

  updatePivotRows(uuid, action) {
    return function(event) {
      action({'uuid':uuid, 'numRows':event.target.value|0})
    };
  }

  addNewPivotView(action) {
    let pivotPageSize = this.state.defaultPivotPageSize;
    return function(event) {
      action({'uuid':uuid(), 'numRows':pivotPageSize})
    };
  }

  storeState() {
    let pivotState = Object.assign({}, this.state.pivots);

    for (let uuid in pivotState) {
      if (pivotState.hasOwnProperty(uuid) && typeof this.props.pivots[uuid] !== 'undefined') {
        pivotState[uuid] = pivotRefToProps(pivotState[uuid]);
        pivotState[uuid].numRows = this.props.pivots[uuid].numRows;

        this.props.updatePivotView(uuid, pivotState[uuid]);
      }
    }

    let toStore = {
      filters: this.props.filters.slice().map(filter => {
        return {
          type: filter.type,
          typeLabel: filter.typeLabel,
          value: filter.value
        };
      }),
      filterMethod: this.props.filterMethod,
      advancedFilters: this.props.advancedFilters,
      pivots: pivotState,
      rowsPerPage: this.props.rowsPerPage,
      startDate: this.props.startDate,
      endDate: this.props.endDate
    };

    this.props.saveProfile(toStore);

    this.setState({pivots: {}})
  }

  /**
   * Computes the frequency at which the reports should fetch information
   * from the server. Smaller reporting windows query at a faster rate, and
   * larger windows query at a slower rate
   *
   * @param {int} reportWindow The number of milliseconds that the reporting
   *                           window of covers
   */
  computeRefreshFrequency(reportWindow) {
    let oneDay = 86400000;
    return Math.max(5, Math.min(30, Math.ceil(reportWindow / oneDay) * 5)) * 1000;
  }

  render() {
    let data = [];

    // Create scoped variable to make maps less tedious
    let props = this.props;

    if (props.filterMethod === 'advanced') {
      let filter = generateFilterFn(props.advancedFilters);
      data = filter(props.rows);
    } else {
      // If there are no filters set, then the full data set should be shown
      if (props.filters.length === 0) {
        data = props.rows;
      } else {

        // If the filter method is additive, then accept any record that satisfies
        // one or more filters
        if (props.filterMethod === 'additive') {
          data = props.rows.filter(function(point) {
            return props.filters.reduce(
              function(include, filter) {
                return include || filter.fn(point)
              },
              false
            );
          });
        } else {

          // Otherwise only accept rows that match all of the filters
          data = props.filters.reduce(
            function(data, filter) {
              return data.filter(filter.fn);
            },
            props.rows
          );
        }
      }
    }

    let pivotUpdate = this.updatePivotRef.bind(this);

    return (
      <div className="transaction-viewer">
        <div className="transaction-filters">
          <div className="filters-wrapper">
            <div className="transaction-date-filters">
              <h3>Date Range</h3>
              <DateManager/>
            </div>
            <div className="transaction-time-filters">
              <h3>Time Range</h3>
              <TimeRangePicker/>
            </div>
            <div className="transaction-field-filters">
              <h3>Filters</h3>
              <FilterManager/>
            </div>
          </div>
        </div>

        <div className="transaction-viewer-data">
          <div className="data-wrapper">
            <h3>Records [{data.length}]</h3>
            <TransactionTable data={data} />
            <h3>Pivot Views</h3>
            <ul className="transaction-pivot-views">
              {Object.keys(props.pivots).map((uuid, index) => {
                let remove = <button className="transaction-pivot-remove" onClick={() => props.removePivotView(uuid)}>
                  Remove View
                </button>;

                return (
                  <li key={uuid}>
                    <div>
                      <h4>
                        View {index + 1} {remove}
                      </h4>
                    </div>
                    <div className="transaction-records-per-page">
                      <label className="per-page-control">
                        <span>Show </span>
                        <select onChange={this.updatePivotRows(uuid,props.changeRowsPerPivot)} value={props.pivots[uuid].numRows}>
                          {this.state.pivotPageSizes.map((opt, index) => <option key={index} value={opt}>{opt}</option>)}
                        </select>
                        <span> rows per page</span>
                      </label>
                    </div>
                    <div className="transaction-pivot-table">
                      <ReactPivot
                        ref={ref => pivotUpdate(uuid, ref)}
                        rows={data}
                        dimensions={props.dimensions}
                        reduce={props.reduce || reduce}
                        calculations={props.calculations || calculations}
                        hiddenColumns={props.pivots[uuid].hiddenColumns || ['Average', 'Max']}
                        activeDimensions={props.pivots[uuid].dimensions}
                        nPaginateRows={props.pivots[uuid].numRows} />

                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="transaction-pivot-table-add">
              <button onClick={this.addNewPivotView(props.addPivotView)}> Add New Pivot View </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connector(TransactionReport);