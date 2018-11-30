import axios from 'axios';
import debounce from 'lodash.debounce';
import * as actions from './actions';
import moment from 'moment';

export function configure(configuration) {
  return {type: SET_CONFIG, value: configuration};
}

export function loadFields(dispatch, getState) {
  return axios.get(getState().config.endpoints.fields)
    .then(function(response) {
      dispatch({type: actions.RECEIVED_FIELDS, value: response.data});
    });

  // return dispatch({type: actions.RECEIVED_FIELDS, value: [
  //   { value: 'datetime', title: 'Date Time', hide:[] },
  //   { value: 'date', title: 'Date', hide:['table'] },
  //   { value: 'time', title: 'Time', hide:['table'] },
  //   { value: 'source', title: 'Origin', hide:[] },
  //   { value: 'program', title: 'Program', hide:[]},
  //   { value: 'pledge_code', title: 'Pledge Code', hide:[] },
  //   { value: 'prem_1', title: 'Prem 1', hide:[] },
  //   { value: 'prem_2', title: 'Prem 2', hide:[] },
  //   { value: 'payment_type', title: 'Payment Type', hide:[] },
  //   { value: 'one_time', title: 'One Time Amount', hide:[] },
  //   { value: 'monthly', title: 'Monthly Amount', hide:[] },
  //   { value: 'zip_code', title: 'Zipcode', hide:[] },
  //   { value: 'first', title: 'First', hide:[] },
  //   { value: 'last', title: 'Last', hide:[] },
  //   { value: 'city', title: 'City', hide:[] },
  //   { value: 'existing_member', title: 'Existing Member', hide:[] },
  //   { value: 'member_number', title: 'Member Number', hide:[] },
  //   { value: 'payment_method', title: 'Payment Method', hide:[] },
  //   { value: 'approved', title: 'Approved?', hide:[] }
  // ]});
}

export function fetchData(dispatch, getState) {
  return updateDataHelper(dispatch, getState);
}

export function receiveData(data) {
  return {type: actions.RECEIVED_DATA, value: data};
}

export function changeRowsPerPage(rowsPerPage) {
  return {type: actions.CHANGE_ROWS_PER_PAGE, value: rowsPerPage};
}

export function changeRowsPerPivot(rowsPerPivotData) {
  return {type: actions.CHANGE_ROWS_PER_PIVOT, value: rowsPerPivotData};
}

export function addFilter(filter) {
  return {type: actions.ADD_FILTER, value: filter};
}

export function removeFilter(id) {
  return {type: actions.REMOVE_FILTER, value: id};
}

export function setFilterMode(mode) {
  return {type: actions.SET_FILTER_MODE, value: mode};
}

export function setAdvancedFilters(filterList) {
  return {type: actions.SET_ADVANCED_FILTERS, value: filterList};
}

let updateDataHelper = debounce(
  function updateDataHelper(dispatch, getState) {
    let start = getState().startDate;
    let end = getState().endDate || Date.now();

    return axios.get(`${getState().config.endpoints.transaction}?start=${start}&end=${end}`)
      .then(function(response) {
        dispatch(receiveData(response.data));
      });
  },
  250
);

export function setStartDate(startDate) {
  return function(dispatch, getState) {
    dispatch({type: actions.SET_START_DATE, value: startDate});
    updateDataHelper(dispatch, getState);
  };
}

export function setEndDate(endDate) {
  return function(dispatch, getState) {
    dispatch({type: actions.SET_END_DATE, value: endDate});
    updateDataHelper(dispatch, getState);
  };
}

export function removeEndDate(dispatch, getState) {
  dispatch({type: actions.REMOVE_END_DATE, value: null});
  updateDataHelper(dispatch, getState);
}

export function addPivotView(newPivotData) {
  return {type: actions.ADD_PIVOT_VIEW, value: newPivotData};
}

export function removePivotView(uuid) {
  return {type: actions.REMOVE_PIVOT_VIEW, value: uuid};
}

export function loadProfile(dispatch, getState) {
  return axios.get(getState().config.endpoints.profile)
    .then(function(response) {
      let settings = {
        startDate: moment(response.startDate),
        endDate: moment(response.endDate),
        filters: response.filters.forEach(filter => {
          filter.fn = function (input) {
            let point = input[filter.type] !== null ? input[filter.type] : '';

            // Transform the record data point to a string and perform a simple
            // search to determine matches
            return point.toString().search(new RegExp(filter.value, 'i')) !== -1;
          }
        }),
        pivots: response.pivots
      };

      dispatch({type: actions.RECEIVED_PROFILE, value: settings});
    });
}

export function updateProfile(toStore) {
  return function(dispatch, getState) {
    return axios.patch(
      this.props.config.endpoints.profile,
      toStore
    ).then(function(response) {
      dispatch({type: actions.UPDATED_PROFILE, value: null});
    });
  };
}