// @flow

import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import { connect } from 'react-redux';
import * as actions from './actions/actions';
import * as actionCreators from './actions/creators';
import moment from 'moment';

export type PaymentMethod = 'EFT' | 'Credit' | 'Paypal'

export type Record = {
  timestamp: number,
  source: string,
  program: string,
  pledge_code: string,
  prem_1: string,
  prem_2: string,
  payment_type: string,
  one_time: number|null,
  monthly: number|null,
  zip_code: string,
  first: string,
  last: string,
  city: string,
  existing_member: boolean,
  member_number: string|null,
  payment_method: PaymentMethod,
  approved: string,
  date: string
};
type Filter = {
  type: string,
  typeLabel: string,
  value: string|number,
  fn: (input: string|number) => bool
};
type FilterMethod = 'additive' | 'subtractive' | 'advanced';
type State = {
  +rows: Array<Record>,
  +dimensions: Array<{value: string, title: string, hide: Array<string>}>,
  +filters: Array<Filter>,
  +filterMethod: FilterMethod,
  +advancedFilters: Array<AdvancedFilterGroup>,
  +rowsPerPage: number,
  +pivots: {},
  +startDate: moment,
  +endDate: moment,
  +nonce: string,
  +user: {id: number}
}

type AdvancedFilter = {
  id: string,
  dimension: string,
  dimensionLabel: string,
  value: string,
  condition: 'equals' | 'not equal to'
}

type AdvancedFilterGroup = {
  id: string,
  filters: Array<AdvancedFilter>,
}

// Define the application data structure with initial values
const defaultState: State = {
  rows: [],
  dimensions: [
    { value: 'datetime', title: 'Date Time', hide:[] },
    { value: 'date', title: 'Date', hide:['table'] },
    { value: 'time', title: 'Time', hide:['table'] },
    { value: 'source', title: 'Origin', hide:[] },
    { value: 'program', title: 'Program', hide:[]},
    { value: 'pledge_code', title: 'Pledge Code', hide:[] },
    { value: 'prem_1', title: 'Prem 1', hide:[] },
    { value: 'prem_2', title: 'Prem 2', hide:[] },
    { value: 'payment_type', title: 'Payment Type', hide:[] },
    { value: 'one_time', title: 'One Time Amount', hide:[] },
    { value: 'monthly', title: 'Monthly Amount', hide:[] },
    { value: 'zip_code', title: 'Zipcode', hide:[] },
    { value: 'first', title: 'First', hide:[] },
    { value: 'last', title: 'Last', hide:[] },
    { value: 'city', title: 'City', hide:[] },
    { value: 'existing_member', title: 'Existing Member', hide:[] },
    { value: 'member_number', title: 'Member Number', hide:[] },
    { value: 'payment_method', title: 'Payment Method', hide:[] },
    { value: 'approved', title: 'Approved?', hide:[] },
  ],
  filters: [],
  filterMethod: 'subtractive',
  advancedFilters: [],
  rowsPerPage: 25,
  pivots: {},
  startDate: moment().hours(0).minutes(0),
  endDate: moment().hours(23).minutes(59),
  nonce: '',
  user: {id: 0}
};

let initialState = defaultState;

// Begin hydrate process for user data
if (window.wpData && window.wpData.user) {
  if (window.wpData.user.settings) {
    if (window.wpData.user.settings.startDate) {
      window.wpData.user.settings.startDate = moment(window.wpData.user.settings.startDate);
    }

    if (window.wpData.user.settings.endDate) {
      window.wpData.user.settings.endDate = moment(window.wpData.user.settings.endDate);
    }

    (window.wpData.user.settings.filters || []).forEach(filter => {
      filter.fn = function (input) {
        let point = input[filter.type] !== null ? input[filter.type] : '';

        // Transform the record data point to a string and perform a simple
        // search to determine matches
        return point.toString().search(new RegExp(filter.value, 'i')) !== -1;
      }
    });

    Object.keys(window.wpData.user.settings.pivots || {}).forEach(key => {
      window.wpData.user.settings.pivots[key] = window.wpData.user.settings.pivots[key];
    });
  }

  initialState = Object.assign(
    {},
    defaultState,
    {user: {id: window.wpData.user.id || 0}},
    window.wpData.user.settings || {},
    {nonce: window.wpData.nonce}
  );
}

const reducer = function reducer(state: State = defaultState, action) {
  switch (action.type) {

    // Handle new data from the server
    case actions.RECEIVED_DATA:

      // Clone the data so as not to mutate the existing data
      let newData = action.value.slice();

      return Object.assign(
        {},
        state,
        {
          rows: newData.map(record => {

            let newRecord = Object.assign({}, record);

            let datetime = new Date(record.timestamp * 1000);

            // Add a human readable version of the date to the data
            newRecord.datetime = datetime.toLocaleString();

            newRecord.time = datetime.toLocaleTimeString();

            newRecord.date = datetime.toLocaleDateString();

            // Change the approved flag into a human readable version
            newRecord.approved = record.approved ? 'Yes' : 'No';

            newRecord.source = record.source === 'DE' ? 'WEB' : record.source;

            return newRecord;
          })
        }
      );

    case actions.CHANGE_ROWS_PER_PAGE:
      return Object.assign(
        {},
        state,
        {rowsPerPage: action.value}
      );

    case actions.ADD_FILTER:
      let moreFilters = state.filters.slice();
      moreFilters.push(action.value);

      return Object.assign(
        {},
        state,
        {filters: moreFilters}
      );

    case actions.REMOVE_FILTER:
      let lessFilters = state.filters.slice();
      lessFilters.splice(action.value, 1);

      return Object.assign(
        {},
        state,
        {filters: lessFilters}
      );

    case actions.SET_FILTER_MODE:
      return Object.assign(
        {},
        state,
        {filterMethod: action.value}
      );

    case actions.SET_ADVANCED_FILTERS:
      return Object.assign(
        {},
        state,
        {advancedFilters: action.value}
      );

    case actions.SET_START_DATE:
      return Object.assign(
        {},
        state,
        {startDate: action.value}
      );

    case actions.SET_END_DATE:
      return Object.assign(
        {},
        state,
        {endDate: action.value}
      );

    case actions.REMOVE_END_DATE:
      return Object.assign(
        {},
        state,
        {endDate: null}
      );

    case actions.ADD_PIVOT_VIEW:
      let morePivots = Object.assign({}, state.pivots);
      morePivots[action.value.uuid] = {};
      morePivots[action.value.uuid].numRows = action.value.numRows;
      return Object.assign(
        {},
        state,
        {pivots: morePivots}
      );

    case actions.REMOVE_PIVOT_VIEW:
      let lessPivots = Object.assign({}, state.pivots);

      if (typeof lessPivots[action.value] !== 'undefined') {
        delete lessPivots[action.value];
      }

      return Object.assign(
        {},
        state,
        {pivots: lessPivots}
      );

    case actions.CHANGE_ROWS_PER_PIVOT:
      let pivots = Object.assign({}, state.pivots);

      if (typeof pivots[action.value.uuid] !== 'undefined') {
        let newPivot = Object.assign({}, pivots[action.value.uuid]);
        newPivot.numRows = action.value.numRows;

        pivots[action.value.uuid] = newPivot;
      }

      return Object.assign(
        {},
        state,
        {pivots: pivots}
      );

    default:
      return state;
  }
};

const composer = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const store = createStore(
  reducer,
  initialState,
  composer(
    applyMiddleware(thunk)
  )
);

const mapStateToProps = function mapStateToProps(state) {
  return {
    rows: state.rows,
    dimensions: state.dimensions,
    filters: state.filters,
    filterMethod: state.filterMethod,
    advancedFilters: state.advancedFilters,
    rowsPerPage: state.rowsPerPage,
    pivots: state.pivots,
    startDate: state.startDate,
    endDate: state.endDate,
    nonce: state.nonce,
    user: state.user
  };
};

/**
 * Accepts a nonce generated by the server and generates the
 * mapDispatchToProps function that is used by redux
 *
 * @param {string} wpNonce A server generated nonce
 * @returns {function}
 */
const mapDispatchToPropsGenerator = function mapDispatchToPropsGenerator(wpNonce) {
  return function mapDispatchToProps(dispatch) {
    return {
      fetchData() {
        actionCreators.fetchData(wpNonce)(dispatch, store.getState);
      },
      receiveData(data) {
        dispatch(actionCreators.receiveData(data));
      },
      changeRowsPerPage(rowsPerPage) {
        dispatch(actionCreators.changeRowsPerPage(rowsPerPage));
      },
      changeRowsPerPivot(rowsPerPivotData) {
        dispatch(actionCreators.changeRowsPerPivot(rowsPerPivotData));
      },
      addFilter(filter) {
        dispatch(actionCreators.addFilter(filter));
      },
      removeFilter(id) {
        dispatch(actionCreators.removeFilter(id));
      },
      setFilterMode(mode) {
        dispatch(actionCreators.setFilterMode(mode));
      },
      setAdvancedFilters(filterList) {
        dispatch(actionCreators.setAdvancedFilters(filterList));
      },
      setStartDate(startDate) {
        actionCreators.setStartDate(wpNonce)(startDate)(dispatch, store.getState);
      },
      setEndDate(endDate) {
        actionCreators.setEndDate(wpNonce)(endDate)(dispatch, store.getState);
      },
      removeEndDate() {
        actionCreators.removeEndDate(wpNonce)(dispatch, store.getState);
      },
      addPivotView(newPivotData) {
        dispatch(actionCreators.addPivotView(newPivotData));
      },
      removePivotView(uuid) {
        dispatch(actionCreators.removePivotView(uuid));
      }
    };
  };
};

// If a nonce is not found then empty string will be used. This will should
// intentionally cause communication with the server to fail
const connector = connect(
  mapStateToProps,
  mapDispatchToPropsGenerator(
    (window.wpData && window.wpData.nonce) || ''
  )
);

function testRow(row: Record, filterDimension:string, filterValue: string) {
  let point = row[filterDimension] !== null && typeof row[filterDimension] !== 'undefined' ? row[filterDimension] : '';

  return point.toString().search(new RegExp(filterValue, 'i')) !== -1;
}
function generateFilterFn(filterList: Array<AdvancedFilterGroup>) {
  return function(rows: Array<Record>) {
    return rows.filter(function(row) {
      return filterList.reduce(
        function(keepRow, filterGroup) {
          let matchesGroup = filterGroup.filters.reduce(
           function(keep,filterItem) {
             if (filterItem.condition === 'equals') {
               return keep || testRow(row, filterItem.dimension, filterItem.value);
             } else {
               return keep || !testRow(row, filterItem.dimension, filterItem.value);
             }
           }, false
          );
          return keepRow && matchesGroup;
        }, true
      );
    });
  }
}

export { store, connector, generateFilterFn };