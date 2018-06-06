import axios from 'axios';
import debounce from 'lodash.debounce';
import * as actions from './actions';

export function fetchData(nonce) {
  return function (dispatch, getState) {
    updateDataHelper(dispatch, getState, nonce);
  }
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
  function updateDataHelper(dispatch, getState, nonce) {
    let start = getState().startDate;
    let end = getState().endDate || Date.now();

    return axios.get(`/admin/transactions/?start=${start}&end=${end}&nonce=${nonce}`).then(function(data) {
      dispatch(receiveData(data));
    });
  },
  250
);

export function setStartDate(nonce) {
  return function(startDate) {
    return function(dispatch, getState) {
      dispatch({type: actions.SET_START_DATE, value: startDate});
      updateDataHelper(dispatch, getState, nonce);
    };
  }
}

export function setEndDate(nonce) {
  return function(endDate) {
    return function(dispatch, getState) {
      dispatch({type: actions.SET_END_DATE, value: endDate});
      updateDataHelper(dispatch, getState, nonce);
    };
  }
}

export function removeEndDate(nonce) {
  return function(dispatch, getState) {
    dispatch({type: actions.REMOVE_END_DATE, value: null});
    updateDataHelper(dispatch, getState, nonce);
  };
}

export function addPivotView(newPivotData) {
  return {type: actions.ADD_PIVOT_VIEW, value: newPivotData};
}

export function removePivotView(uuid) {
  return {type: actions.REMOVE_PIVOT_VIEW, value: uuid};
}