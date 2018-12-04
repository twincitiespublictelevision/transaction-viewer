// @flow

import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import { connect } from 'react-redux';
import * as actions from './actions/actions';
import * as actionCreators from './actions/creators';
import moment from 'moment';

export type Endpoints = {|
  fields: string,
  profile: string,
  transactions: string
|};

export type Config = {|
  endpoints: Endpoints
|};

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
  +config: Config,
  +rows: Array<Record>,
  +dimensions: Array<{value: string, title: string, hide: Array<string>}>,
  +filters: Array<Filter>,
  +filterMethod: FilterMethod,
  +advancedFilters: Array<AdvancedFilterGroup>,
  +rowsPerPage: number,
  +pivots: {},
  +startDate: moment,
  +endDate: moment
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
  config: {
    endpoints: {
      fields: '',
      profile: '',
      transactions: ''
    }
  },
  rows: [],
  dimensions: [],
  filters: [],
  filterMethod: 'subtractive',
  advancedFilters: [],
  rowsPerPage: 25,
  pivots: {},
  startDate: moment().hours(0).minutes(0),
  endDate: moment().hours(23).minutes(59)
};

let initialState = defaultState;

const reducer = function reducer(state: State = defaultState, action) {
  switch (action.type) {

    case actions.SET_CONFIG:
      return Object.assign(
        {},
        state,
        {config: action.value}
      );

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

    case actions.UPDATE_PIVOT_SETTINGS: {
      let pivots = Object.assign({}, state.pivots);
      pivots[action.value.uuid] = action.value.state;

      return Object.assign(
        {},
        state,
        {pivots}
      );
    }

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

    case actions.RECEIVED_PROFILE:
      return Object.assign(
        {},
        state,
        action.value
      );

    case actions.RECEIVED_FIELDS:
      return Object.assign(
        {},
        state,
        { dimensions: action.value }
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
    config: state.config,
    rows: state.rows,
    dimensions: state.dimensions,
    filters: state.filters,
    filterMethod: state.filterMethod,
    advancedFilters: state.advancedFilters,
    rowsPerPage: state.rowsPerPage,
    pivots: state.pivots,
    startDate: state.startDate,
    endDate: state.endDate
  };
};

const mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    setConfig(config) {
      dispatch(actionCreators.configure(config));
    },
    loadFields() {
      return actionCreators.loadFields(dispatch, store.getState);
    },
    fetchData() {
      return actionCreators.fetchData(dispatch, store.getState);
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
      actionCreators.setStartDate(startDate)(dispatch, store.getState);
    },
    setEndDate(endDate) {
      actionCreators.setEndDate(endDate)(dispatch, store.getState);
    },
    removeEndDate() {
      actionCreators.removeEndDate(dispatch, store.getState);
    },
    addPivotView(newPivotData) {
      dispatch(actionCreators.addPivotView(newPivotData));
    },
    removePivotView(uuid) {
      dispatch(actionCreators.removePivotView(uuid));
    },
    updatePivotView(uuid, pivotState) {
      dispatch(actionCreators.updatePivotView(uuid, pivotState));
    },
    loadProfile() {
      return actionCreators.loadProfile(dispatch, store.getState);
    },
    saveProfile(data) {
      return actionCreators.updateProfile(data)(dispatch, store.getState);
    }
  };
};

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
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