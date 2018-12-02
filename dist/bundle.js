import axios from 'axios';
import debounce from 'lodash.debounce';
import moment from 'moment';
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import { connect, Provider } from 'react-redux';
import React, { Component } from 'react';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import uuid from 'uuid/v4';
import ReactPivot from 'react-pivot';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

//      
var SET_CONFIG = 'setConfig';
var RECEIVED_FIELDS = 'recievedFields';
var RECEIVED_DATA = 'recievedData';
var CHANGE_ROWS_PER_PAGE = 'changeRowsPerPage';
var CHANGE_ROWS_PER_PIVOT = 'changeRowsPerPivot';
var ADD_FILTER = 'addFilter';
var REMOVE_FILTER = 'removeFilter';
var SET_FILTER_MODE = 'setFilterMode';
var SET_ADVANCED_FILTERS = 'setAdvancedFilters';
var SET_START_DATE = 'setStartDate';
var SET_END_DATE = 'setEndDate';
var REMOVE_END_DATE = 'removeEndDate';
var ADD_PIVOT_VIEW = 'addPivotView';
var REMOVE_PIVOT_VIEW = 'removePivotView';
var RECEIVED_PROFILE = 'recievedProfile';
var UPDATED_PROFILE = 'updatedProfile';

function configure(configuration) {
  return {
    type: SET_CONFIG,
    value: configuration
  };
}
function loadFields(dispatch, getState) {
  return axios.get(getState().config.endpoints.fields).then(function (response) {
    dispatch({
      type: RECEIVED_FIELDS,
      value: response.data
    });
  }); // return dispatch({type: actions.RECEIVED_FIELDS, value: [
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
function fetchData(dispatch, getState) {
  return updateDataHelper(dispatch, getState);
}
function receiveData(data) {
  return {
    type: RECEIVED_DATA,
    value: data
  };
}
function changeRowsPerPage(rowsPerPage) {
  return {
    type: CHANGE_ROWS_PER_PAGE,
    value: rowsPerPage
  };
}
function changeRowsPerPivot(rowsPerPivotData) {
  return {
    type: CHANGE_ROWS_PER_PIVOT,
    value: rowsPerPivotData
  };
}
function addFilter(filter) {
  return {
    type: ADD_FILTER,
    value: filter
  };
}
function removeFilter(id) {
  return {
    type: REMOVE_FILTER,
    value: id
  };
}
function setFilterMode(mode) {
  return {
    type: SET_FILTER_MODE,
    value: mode
  };
}
function setAdvancedFilters(filterList) {
  return {
    type: SET_ADVANCED_FILTERS,
    value: filterList
  };
}
var updateDataHelper = debounce(function updateDataHelper(dispatch, getState) {
  var start = getState().startDate;
  var end = getState().endDate; // Transform to timestamps

  start = start && start.format && start.format('x') || null;
  end = end && end.format && end.format('x') || Date.now();
  return axios.get("".concat(getState().config.endpoints.transactions, "?start=").concat(start, "&end=").concat(end)).then(function (response) {
    dispatch(receiveData(response.data));
  });
}, 250);
function setStartDate(startDate) {
  return function (dispatch, getState) {
    dispatch({
      type: SET_START_DATE,
      value: startDate
    });
    updateDataHelper(dispatch, getState);
  };
}
function setEndDate(endDate) {
  return function (dispatch, getState) {
    dispatch({
      type: SET_END_DATE,
      value: endDate
    });
    updateDataHelper(dispatch, getState);
  };
}
function removeEndDate(dispatch, getState) {
  dispatch({
    type: REMOVE_END_DATE,
    value: null
  });
  updateDataHelper(dispatch, getState);
}
function addPivotView(newPivotData) {
  return {
    type: ADD_PIVOT_VIEW,
    value: newPivotData
  };
}
function removePivotView(uuid$$1) {
  return {
    type: REMOVE_PIVOT_VIEW,
    value: uuid$$1
  };
}
function loadProfile(dispatch, getState) {
  return axios.get(getState().config.endpoints.profile).then(function (response) {
    var filters = response.data.filters || [];
    filters.forEach(function (filter) {
      filter.fn = function (input) {
        var point = input[filter.type] !== null ? input[filter.type] : ''; // Transform the record data point to a string and perform a simple
        // search to determine matches

        return point.toString().search(new RegExp(filter.value, 'i')) !== -1;
      };
    });
    var settings = {
      startDate: moment(response.data.startDate),
      endDate: moment(response.data.endDate),
      filters: filters,
      pivots: response.data.pivots
    };
    dispatch({
      type: RECEIVED_PROFILE,
      value: settings
    });
  });
}
function updateProfile(toStore) {
  return function (dispatch, getState) {
    return axios.patch(getState().config.endpoints.profile, toStore).then(function (response) {
      dispatch({
        type: UPDATED_PROFILE,
        value: null
      });
    });
  };
}

var defaultState = {
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
var initialState = defaultState;

var reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case SET_CONFIG:
      return Object.assign({}, state, {
        config: action.value
      });
    // Handle new data from the server

    case RECEIVED_DATA:
      // Clone the data so as not to mutate the existing data
      var newData = action.value.slice();
      return Object.assign({}, state, {
        rows: newData.map(function (record) {
          var newRecord = Object.assign({}, record);
          var datetime = new Date(record.timestamp * 1000); // Add a human readable version of the date to the data

          newRecord.datetime = datetime.toLocaleString();
          newRecord.time = datetime.toLocaleTimeString();
          newRecord.date = datetime.toLocaleDateString(); // Change the approved flag into a human readable version

          newRecord.approved = record.approved ? 'Yes' : 'No';
          newRecord.source = record.source === 'DE' ? 'WEB' : record.source;
          return newRecord;
        })
      });

    case CHANGE_ROWS_PER_PAGE:
      return Object.assign({}, state, {
        rowsPerPage: action.value
      });

    case ADD_FILTER:
      var moreFilters = state.filters.slice();
      moreFilters.push(action.value);
      return Object.assign({}, state, {
        filters: moreFilters
      });

    case REMOVE_FILTER:
      var lessFilters = state.filters.slice();
      lessFilters.splice(action.value, 1);
      return Object.assign({}, state, {
        filters: lessFilters
      });

    case SET_FILTER_MODE:
      return Object.assign({}, state, {
        filterMethod: action.value
      });

    case SET_ADVANCED_FILTERS:
      return Object.assign({}, state, {
        advancedFilters: action.value
      });

    case SET_START_DATE:
      return Object.assign({}, state, {
        startDate: action.value
      });

    case SET_END_DATE:
      return Object.assign({}, state, {
        endDate: action.value
      });

    case REMOVE_END_DATE:
      return Object.assign({}, state, {
        endDate: null
      });

    case ADD_PIVOT_VIEW:
      var morePivots = Object.assign({}, state.pivots);
      morePivots[action.value.uuid] = {};
      morePivots[action.value.uuid].numRows = action.value.numRows;
      return Object.assign({}, state, {
        pivots: morePivots
      });

    case REMOVE_PIVOT_VIEW:
      var lessPivots = Object.assign({}, state.pivots);

      if (typeof lessPivots[action.value] !== 'undefined') {
        delete lessPivots[action.value];
      }

      return Object.assign({}, state, {
        pivots: lessPivots
      });

    case CHANGE_ROWS_PER_PIVOT:
      var pivots = Object.assign({}, state.pivots);

      if (typeof pivots[action.value.uuid] !== 'undefined') {
        var newPivot = Object.assign({}, pivots[action.value.uuid]);
        newPivot.numRows = action.value.numRows;
        pivots[action.value.uuid] = newPivot;
      }

      return Object.assign({}, state, {
        pivots: pivots
      });

    case RECEIVED_PROFILE:
      return Object.assign({}, state, action.value);

    case RECEIVED_FIELDS:
      return Object.assign({}, state, {
        dimensions: action.value
      });

    default:
      return state;
  }
};

var composer = (typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
var store = createStore(reducer, initialState, composer(applyMiddleware(thunk)));

var mapStateToProps = function mapStateToProps(state) {
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

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    setConfig: function setConfig(config) {
      dispatch(configure(config));
    },
    loadFields: function loadFields$$1() {
      return loadFields(dispatch, store.getState);
    },
    fetchData: function fetchData$$1() {
      return fetchData(dispatch, store.getState);
    },
    receiveData: function receiveData$$1(data) {
      dispatch(receiveData(data));
    },
    changeRowsPerPage: function changeRowsPerPage$$1(rowsPerPage) {
      dispatch(changeRowsPerPage(rowsPerPage));
    },
    changeRowsPerPivot: function changeRowsPerPivot$$1(rowsPerPivotData) {
      dispatch(changeRowsPerPivot(rowsPerPivotData));
    },
    addFilter: function addFilter$$1(filter) {
      dispatch(addFilter(filter));
    },
    removeFilter: function removeFilter$$1(id) {
      dispatch(removeFilter(id));
    },
    setFilterMode: function setFilterMode$$1(mode) {
      dispatch(setFilterMode(mode));
    },
    setAdvancedFilters: function setAdvancedFilters$$1(filterList) {
      dispatch(setAdvancedFilters(filterList));
    },
    setStartDate: function setStartDate$$1(startDate) {
      setStartDate(startDate)(dispatch, store.getState);
    },
    setEndDate: function setEndDate$$1(endDate) {
      setEndDate(endDate)(dispatch, store.getState);
    },
    removeEndDate: function removeEndDate$$1() {
      removeEndDate(dispatch, store.getState);
    },
    addPivotView: function addPivotView$$1(newPivotData) {
      dispatch(addPivotView(newPivotData));
    },
    removePivotView: function removePivotView$$1(uuid$$1) {
      dispatch(removePivotView(uuid$$1));
    },
    loadProfile: function loadProfile$$1() {
      return loadProfile(dispatch, store.getState);
    },
    saveProfile: function saveProfile(data) {
      return updateProfile(data)(dispatch, store.getState);
    }
  };
};

var connector = connect(mapStateToProps, mapDispatchToProps);

function testRow(row, filterDimension, filterValue) {
  var point = row[filterDimension] !== null && typeof row[filterDimension] !== 'undefined' ? row[filterDimension] : '';
  return point.toString().search(new RegExp(filterValue, 'i')) !== -1;
}

function generateFilterFn(filterList) {
  return function (rows) {
    return rows.filter(function (row) {
      return filterList.reduce(function (keepRow, filterGroup) {
        var matchesGroup = filterGroup.filters.reduce(function (keep, filterItem) {
          if (filterItem.condition === 'equals') {
            return keep || testRow(row, filterItem.dimension, filterItem.value);
          } else {
            return keep || !testRow(row, filterItem.dimension, filterItem.value);
          }
        }, false);
        return keepRow && matchesGroup;
      }, true);
    });
  };
}

var DateManager =
/*#__PURE__*/
function (_Component) {
  _inherits(DateManager, _Component);

  function DateManager(props) {
    var _this;

    _classCallCheck(this, DateManager);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DateManager).call(this, props));
    _this.state = {
      focusedInput: null
    };
    return _this;
  }

  _createClass(DateManager, [{
    key: "performUpdate",
    value: function performUpdate(from, change, action) {
      // Pull the time from the current date times and update the new date
      // with it before pushing the change to the store
      change.hours(from.hours());
      change.minutes(from.minutes());
      change.seconds(from.seconds());
      action(change);
    }
  }, {
    key: "importTime",
    value: function importTime(from, base) {
      var m = moment(base); // Pull the time from the current date times and update the new date
      // with them

      m.hours(from.hours());
      m.minutes(from.minutes());
      m.seconds(from.seconds());
      return m;
    }
  }, {
    key: "setDate",
    value: function setDate(_ref) {
      var startDate = _ref.startDate,
          endDate = _ref.endDate;
      // If a start or end date are not sent, then use the currently known
      // value instead
      startDate = startDate instanceof moment ? startDate : this.props.startDate;
      endDate = endDate instanceof moment ? endDate : this.props.endDate; // If the start date and end date are ever the same day, then reset
      // the start and end times so that they cover the full day

      if (startDate.year() === endDate.year() && startDate.month() === endDate.month() && startDate.date() === endDate.date()) {
        // If start date and end date are ever exactly equal, split them as
        // we do not want to mutate both of them. This is a side effect of
        // the way that the datepicker works
        if (startDate === endDate) {
          endDate = moment(endDate);
        }

        startDate.hours(0).minutes(0);
        endDate.hours(23).minutes(59);
      } else {
        startDate = this.importTime(this.props.startDate, startDate);
        endDate = this.importTime(this.props.endDate, endDate);
      }

      this.props.setStartDate(startDate);
      this.props.setEndDate(endDate);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement(DateRangePicker, {
        startDateId: "start-date",
        endDateId: "end-date",
        startDate: this.props.startDate // momentPropTypes.momentObj or null,
        ,
        endDate: this.props.endDate // momentPropTypes.momentObj or null,
        ,
        onDatesChange: this.setDate.bind(this) // PropTypes.func.isRequired,
        ,
        focusedInput: this.state.focusedInput // PropTypes.oneOf([START_DATE, END_DATE]) or null,
        ,
        onFocusChange: function onFocusChange(focusedInput) {
          return _this2.setState({
            focusedInput: focusedInput
          });
        } // PropTypes.func.isRequired,
        ,
        isOutsideRange: function isOutsideRange() {
          return false;
        },
        minimumNights: 0
      });
    }
  }]);

  return DateManager;
}(Component);
var DateManager$1 = connector(DateManager);

var Filter =
/*#__PURE__*/
function (_Component) {
  _inherits(Filter, _Component);

  function Filter() {
    _classCallCheck(this, Filter);

    return _possibleConstructorReturn(this, _getPrototypeOf(Filter).apply(this, arguments));
  }

  _createClass(Filter, [{
    key: "deleteFilter",
    value: function deleteFilter(action) {
      return function () {
        action(this.props.index);
      }.bind(this);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("li", {
        className: "transaction-filter"
      }, React.createElement("span", {
        className: "transaction-filter-label"
      }, React.createElement("span", {
        className: "transaction-filter-label-type"
      }, this.props.typeLabel), " : ", this.props.value), React.createElement("span", {
        className: "transaction-filter-delete",
        onClick: this.deleteFilter(this.props.removeFilter)
      }, "x"));
    }
  }]);

  return Filter;
}(Component);
var Filter$1 = connector(Filter);

var FilterItem =
/*#__PURE__*/
function (_Component) {
  _inherits(FilterItem, _Component);

  function FilterItem(props) {
    _classCallCheck(this, FilterItem);

    return _possibleConstructorReturn(this, _getPrototypeOf(FilterItem).call(this, props));
  }

  _createClass(FilterItem, [{
    key: "removeFilterItem",
    value: function removeFilterItem() {
      this.props.removeFilterItem(this.props.filterItem);
    }
  }, {
    key: "updateFilterValue",
    value: function updateFilterValue(e) {
      this.props.updateFilterValue(this.props.filterItem.id, e.target.value);
    }
  }, {
    key: "updateFilterType",
    value: function updateFilterType(e) {
      this.props.updateFilterType(this.props.filterItem.id, e.target.value);
    }
  }, {
    key: "updateFilterCondition",
    value: function updateFilterCondition(e) {
      this.props.updateFilterCondition(this.props.filterItem.id, e.target.value);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "filter-item"
      }, React.createElement("span", {
        className: "filter-type"
      }, React.createElement("select", {
        value: this.props.filterItem.dimension,
        onChange: this.updateFilterType.bind(this)
      }, React.createElement("option", {
        key: 0,
        value: ""
      }, "Select a type"), // Allow each of the dimensions to have a filter applied to it
      this.props.dimensions.map(function (dim, index) {
        return React.createElement("option", {
          key: index + 1,
          value: dim.value
        }, dim.title);
      }))), React.createElement("span", {
        className: "filter-condition"
      }, React.createElement("select", {
        value: this.props.filterItem.condition,
        onChange: this.updateFilterCondition.bind(this)
      }, React.createElement("option", {
        value: "equals"
      }, "equals"), React.createElement("option", {
        value: "not equal to"
      }, "not equal to"))), React.createElement("span", {
        className: "filter-value"
      }, React.createElement("input", {
        id: "filter-value",
        placeholder: "Filter Value",
        value: this.props.filterItem.value,
        onChange: this.updateFilterValue.bind(this)
      })), React.createElement("span", {
        className: "filter-remove"
      }, React.createElement("i", {
        className: "fa fa-close fa-large",
        onClick: this.removeFilterItem.bind(this)
      })), React.createElement("span", {
        className: "filter-group-condition"
      }, this.props.showCondition));
    }
  }]);

  return FilterItem;
}(Component);

var FilterItem$1 = connector(FilterItem);

var FilterGroup =
/*#__PURE__*/
function (_Component) {
  _inherits(FilterGroup, _Component);

  function FilterGroup(props) {
    _classCallCheck(this, FilterGroup);

    return _possibleConstructorReturn(this, _getPrototypeOf(FilterGroup).call(this, props));
  }

  _createClass(FilterGroup, [{
    key: "removeFilterItem",
    value: function removeFilterItem(filterItem) {
      this.props.removeFilterItem(this.props.index, filterItem);
    }
  }, {
    key: "addFilterItem",
    value: function addFilterItem() {
      this.props.addFilterItem(this.props.index);
    }
  }, {
    key: "removeFilterGroup",
    value: function removeFilterGroup() {
      this.props.removeFilterGroup(this.props.index);
    }
  }, {
    key: "updateFilterValue",
    value: function updateFilterValue(filterID, val) {
      this.props.updateFilterValue(this.props.index, filterID, val);
    }
  }, {
    key: "updateFilterType",
    value: function updateFilterType(filterID, val) {
      this.props.updateFilterType(this.props.index, filterID, val);
    }
  }, {
    key: "updateFilterCondition",
    value: function updateFilterCondition(filterID, val) {
      this.props.updateFilterCondition(this.props.index, filterID, val);
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      return React.createElement("div", {
        className: "filter-group"
      }, this.props.filterItems.map(function (filteritem, index) {
        return React.createElement(FilterItem$1, {
          key: filteritem.id,
          dimensions: _this.props.dimensions,
          filterItem: filteritem,
          removeFilterItem: _this.removeFilterItem.bind(_this),
          updateFilterValue: _this.updateFilterValue.bind(_this),
          updateFilterType: _this.updateFilterType.bind(_this),
          updateFilterCondition: _this.updateFilterCondition.bind(_this),
          showCondition: _this.props.filterItems.length !== index + 1 ? "or" : ""
        });
      }), React.createElement("button", {
        className: "btn-filter-or",
        onClick: this.addFilterItem.bind(this)
      }, "OR"));
    }
  }]);

  return FilterGroup;
}(Component);

var FilterGroup$1 = connector(FilterGroup);

var uuid$1 = require('uuid/v4');

var FilterList =
/*#__PURE__*/
function (_Component) {
  _inherits(FilterList, _Component);

  function FilterList(props) {
    var _this;

    _classCallCheck(this, FilterList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterList).call(this, props));
    _this.addFilterGroup = _this.addFilterGroup.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.removeFilterGroup = _this.removeFilterGroup.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.addFilterItem = _this.addFilterItem.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.removeFilterItem = _this.removeFilterItem.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.updateFilterItemType = _this.updateFilterItemType.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.updateFilterItemCondition = _this.updateFilterItemCondition.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.updateFilterItemValue = _this.updateFilterItemValue.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(FilterList, [{
    key: "addFilterGroup",
    value: function addFilterGroup() {
      var filterGroups = this.props.advancedFilters.concat({
        id: uuid$1(),
        filters: [{
          id: 0,
          dimension: '',
          condition: 'equals',
          value: ''
        }]
      });
      this.props.setAdvancedFilters(filterGroups);
    }
  }, {
    key: "removeFilterGroup",
    value: function removeFilterGroup(groupID) {
      var groups = this.props.advancedFilters.filter(function (group) {
        return group.id !== groupID;
      });
      this.props.setAdvancedFilters(groups);
    }
  }, {
    key: "addFilterItem",
    value: function addFilterItem(groupID) {
      var groups = this.props.advancedFilters.slice().map(function (group) {
        if (group.id === groupID) {
          var newGroup = Object.assign({}, group);
          newGroup.filters = group.filters.concat({
            id: uuid$1(),
            dimension: '',
            condition: 'equals',
            value: ''
          });
          return newGroup;
        } else {
          return group;
        }
      });
      this.props.setAdvancedFilters(groups);
    }
  }, {
    key: "updateFilterItemValue",
    value: function updateFilterItemValue(groupID, filterID, val) {
      var groups = this.props.advancedFilters.slice().map(function (group) {
        if (group.id === groupID) {
          var newGroup = Object.assign({}, group);
          newGroup.filters = group.filters.slice().map(function (filterItem) {
            if (filterItem.id === filterID) {
              var newFilterItem = Object.assign({}, filterItem);
              newFilterItem.value = val;
              return newFilterItem;
            } else {
              return filterItem;
            }
          });
          return newGroup;
        } else {
          return group;
        }
      });
      this.props.setAdvancedFilters(groups);
    }
  }, {
    key: "updateFilterItemCondition",
    value: function updateFilterItemCondition(groupID, filterID, val) {
      var groups = this.props.advancedFilters.slice().map(function (group) {
        if (group.id === groupID) {
          var newGroup = Object.assign({}, group);
          newGroup.filters = group.filters.slice().map(function (filterItem) {
            if (filterItem.id === filterID) {
              var newFilterItem = Object.assign({}, filterItem);
              newFilterItem.condition = val;
              return newFilterItem;
            } else {
              return filterItem;
            }
          });
          return newGroup;
        } else {
          return group;
        }
      });
      this.props.setAdvancedFilters(groups);
    }
  }, {
    key: "updateFilterItemType",
    value: function updateFilterItemType(groupID, filterID, val) {
      var groups = this.props.advancedFilters.slice().map(function (group) {
        if (group.id === groupID) {
          var newGroup = Object.assign({}, group);
          newGroup.filters = group.filters.slice().map(function (filterItem) {
            if (filterItem.id === filterID) {
              var newFilterItem = Object.assign({}, filterItem);
              newFilterItem.dimension = val;
              return newFilterItem;
            } else {
              return filterItem;
            }
          });
          return newGroup;
        } else {
          return group;
        }
      });
      this.props.setAdvancedFilters(groups);
    }
  }, {
    key: "removeFilterItem",
    value: function removeFilterItem(groupID, filterItem) {
      var groups = this.props.advancedFilters.slice().map(function (group) {
        if (group.id === groupID) {
          var newGroup = Object.assign({}, group);
          newGroup.filters = group.filters.slice();
          var filterIndex = newGroup.filters.indexOf(filterItem);
          newGroup.filters.splice(filterIndex, 1);
          return newGroup;
        } else {
          return group;
        }
      }); //remove groups that have no filters left

      groups = groups.filter(function (group) {
        return group.filters.length >= 1;
      });
      this.props.setAdvancedFilters(groups);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement("div", {
        className: "filter-controls"
      }, this.props.advancedFilters.map(function (filterGroup) {
        return React.createElement("div", {
          key: filterGroup.id
        }, React.createElement(FilterGroup$1, {
          index: filterGroup.id,
          filterItems: filterGroup.filters,
          removeFilterGroup: _this2.removeFilterGroup,
          updateFilterType: _this2.updateFilterItemType,
          updateFilterCondition: _this2.updateFilterItemCondition,
          updateFilterValue: _this2.updateFilterItemValue,
          addFilterItem: _this2.addFilterItem,
          removeFilterItem: _this2.removeFilterItem
        }), React.createElement("div", {
          className: "group-separate"
        }, React.createElement("h3", null, React.createElement("span", null, "AND"))));
      }), React.createElement("button", {
        onClick: this.addFilterGroup
      }, "Add Filter Group"));
    }
  }]);

  return FilterList;
}(Component);

var FilterList$1 = connector(FilterList);

var uuid$2 = require('uuid/v4');

var FilterManager =
/*#__PURE__*/
function (_Component) {
  _inherits(FilterManager, _Component);

  function FilterManager(props) {
    var _this;

    _classCallCheck(this, FilterManager);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterManager).call(this, props)); // Component keeps track of its own in progress state

    _this.state = {
      createType: '',
      createValue: '',
      createLabel: '',
      createDisabled: true,
      showAdvancedFilters: false
    };
    return _this;
  }

  _createClass(FilterManager, [{
    key: "updateFilterValue",
    value: function updateFilterValue(event) {
      this.setState({
        createValue: event.target.value,
        createDisabled: this.state.createType === '' || event.target.value === ''
      });
    }
  }, {
    key: "updateFilterType",
    value: function updateFilterType(event) {
      var select = event.target;
      this.setState({
        createType: select.value,
        createLabel: select.options[select.selectedIndex].innerHTML,
        createDisabled: select.value === '' || this.state.createValue === ''
      });
    }
  }, {
    key: "createFilter",
    value: function createFilter(action) {
      return function () {
        var filterType = this.state.createType;
        var filterValue = this.state.createValue; // Emit the create filter action based on the internal state of the
        // component

        action({
          type: filterType,
          typeLabel: this.state.createLabel,
          value: filterValue,
          fn: function filter(input) {
            var point = input[filterType] !== null ? input[filterType] : ''; // Transform the record data point to a string and perform a simple
            // search to determine matches

            return point.toString().search(new RegExp(filterValue, 'i')) !== -1;
          }
        });
        this.setState({
          createType: '',
          createLabel: '',
          createValue: '',
          createDisabled: true
        });
      };
    }
  }, {
    key: "changeFilterMode",
    value: function changeFilterMode(event) {
      this.props.setFilterMode(event.target.value);
    }
  }, {
    key: "openAdvancedFilters",
    value: function openAdvancedFilters() {
      this.setState({
        showAdvancedFilters: true
      });
    }
  }, {
    key: "closeAdvancedFilters",
    value: function closeAdvancedFilters(e) {
      this.setState({
        showAdvancedFilters: false
      });
    }
  }, {
    key: "renderAdvancedFiltersInput",
    value: function renderAdvancedFiltersInput() {
      return React.createElement("tbody", {
        className: "advanced-filters"
      }, React.createElement("tr", null, React.createElement("td", null, this.props.filterMethod === 'advanced' && React.createElement("button", {
        className: "transaction-filter-add",
        onClick: this.openAdvancedFilters.bind(this)
      }, "Edit Advanced Filters"))));
    }
  }, {
    key: "renderFiltersInput",
    value: function renderFiltersInput() {
      return React.createElement("tbody", {
        className: "standard-filters"
      }, React.createElement("tr", null, React.createElement("td", null, "Type"), React.createElement("td", null, React.createElement("label", {
        htmlFor: "filter-value"
      }, "Value")), React.createElement("td", null, "\xA0")), React.createElement("tr", null, React.createElement("td", null, React.createElement("select", {
        onChange: this.updateFilterType.bind(this),
        value: this.state.createType
      }, React.createElement("option", {
        key: 0,
        value: ""
      }, "Select a type"), // Allow each of the dimensions to have a filter applied to it
      this.props.dimensions.map(function (dim, index) {
        return React.createElement("option", {
          key: index + 1,
          value: dim.value
        }, dim.title);
      }))), React.createElement("td", null, React.createElement("input", {
        id: "filter-value",
        placeholder: "Filter Value",
        value: this.state.createValue,
        onChange: this.updateFilterValue.bind(this)
      })), React.createElement("td", null, React.createElement("button", {
        className: "transaction-filter-add",
        disabled: this.state.createDisabled,
        onClick: this.createFilter(this.props.addFilter).bind(this)
      }, "Add Filter"))));
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      // Create the list of individual filters that exist
      var filterList = React.createElement("ul", {
        className: "transaction-filter-list"
      }, this.props.filters.map(function (filter, index) {
        return React.createElement(Filter$1, _extends({
          key: index,
          index: index
        }, filter));
      }));
      var appliedFilters = React.createElement("ul", {
        className: "transaction-filter-list"
      }, this.props.advancedFilters.map(function (filterGroup) {
        var filterItems = filterGroup.filters.map(function (filterItem, i) {
          var dimensionIndex = _this2.props.dimensions.findIndex(function (dim) {
            return dim.value === filterItem.dimension;
          });

          if (dimensionIndex >= 0) {
            return _this2.props.dimensions[dimensionIndex].title + " " + (filterItem.condition === "equals" ? "=" : filterItem.condition) + " " + filterItem.value + (filterGroup.filters.length - 1 === i ? '' : ' OR ');
          } else {
            return '';
          }
        });
        return React.createElement("li", {
          key: filterGroup.id + uuid$2,
          className: "transaction-filter"
        }, filterItems);
      }));
      return React.createElement("div", {
        className: "field-filter-inputs"
      }, React.createElement("table", {
        className: "transaction-filter-controls"
      }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("td", null, "Filter Mode"), React.createElement("td", null, React.createElement("select", {
        onChange: this.changeFilterMode.bind(this),
        value: this.props.filterMethod
      }, React.createElement("option", {
        value: "subtractive"
      }, "Match All"), React.createElement("option", {
        value: "additive"
      }, "Match Any"), React.createElement("option", {
        value: "advanced"
      }, "Advanced"))))), this.props.filterMethod === 'advanced' ? this.renderAdvancedFiltersInput() : this.renderFiltersInput()), this.props.filterMethod !== 'advanced' && this.props.filters.length > 0 ? filterList : '', this.props.filterMethod === 'advanced' ? appliedFilters : '', this.state.showAdvancedFilters && React.createElement("div", {
        className: "filter-overlay-wrapper"
      }, React.createElement("div", {
        className: "filter-overlay"
      }, React.createElement("a", {
        className: "no-delay filter-overlay-close body-large",
        onClick: this.closeAdvancedFilters.bind(this)
      }, React.createElement("i", {
        className: "fa fa-save"
      })), React.createElement("h3", null, "Apply Advanced Filters"), React.createElement(FilterList$1, null))));
    }
  }]);

  return FilterManager;
}(Component);

var FilterManager$1 = connector(FilterManager);

function numberComp(a, b) {
  return a - b;
}

function dateComp(a, b) {
  return numberComp(new Date(a), new Date(b));
}

function stringComp(a, b) {
  return a.localeCompare(b);
}
/**
 * Generates a comparator function for sorting
 *
 * @param {boolean} [asc] Optional boolean flag to determine sort ordering
 * @returns {Function}
 */


function sortGen(asc) {
  var dir = asc || false;
  return function (a, b) {
    var result; // If "a" look like a Date then try to sort it as a Date

    if (a instanceof Date || typeof a !== 'number' && !isNaN(new Date(a).getTime())) {
      result = dateComp(a, b);
    } else if (typeof a === 'string') {
      result = stringComp(a, b);
    } else {
      result = numberComp(a, b);
    }

    return dir ? 0 - result : result;
  };
}

var TransactionTable =
/*#__PURE__*/
function (_Component) {
  _inherits(TransactionTable, _Component);

  // Work around as the type of props is not actually known as it can be
  // extended arbitrarily by Redux
  function TransactionTable(props) {
    var _this;

    _classCallCheck(this, TransactionTable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TransactionTable).call(this, props)); // Table manages its own sorting and pagination state

    _this.state = {
      page: 1,
      pageOptions: [0, 5, 10, 25, 50, 100],
      sort: {
        by: 'timestamp',
        asc: false
      }
    };
    return _this;
  }

  _createClass(TransactionTable, [{
    key: "updatePage",
    value: function updatePage(event) {
      this.setState({
        page: parseInt(event.target.value)
      });
    }
  }, {
    key: "updatePerPage",
    value: function updatePerPage(action) {
      return function (event) {
        action(parseInt(event.target.value));
      };
    }
  }, {
    key: "updateSort",
    value: function updateSort(key, isAsc) {
      return function () {
        this.setState({
          sort: {
            by: key,
            asc: isAsc
          }
        });
      }.bind(this);
    }
  }, {
    key: "render",
    value: function render() {
      // Assignment to avoid bind calls
      var props = this.props;
      var state = this.state;
      var maxPages = Math.max(1, Math.ceil(props.data.length / props.rowsPerPage)); // Generate a sort comparator based on the currently defined ordering

      var comp = sortGen(state.sort.asc);
      var sortArrow = state.sort.asc ? React.createElement("span", {
        className: "transaction-sort-asc"
      }, "\xA0") : React.createElement("span", {
        className: "transaction-sort-desc"
      }, "\xA0"); // Clone the data and sort it based on the generated comparator

      var dataSet = props.data.slice().sort(function (a, b) {
        return comp(a[state.sort.by], b[state.sort.by]);
      }); // Once the data is sorted, the data set can be sliced down to the defined
      // page size and page number

      var dataView = dataSet.slice((state.page - 1) * props.rowsPerPage, state.page * props.rowsPerPage);
      var dimensions = props.dimensions.filter(function (dimension) {
        return dimension.hide.indexOf('table') === -1;
      });
      return React.createElement("div", {
        className: "transaction-records"
      }, React.createElement("div", {
        className: "transaction-records-per-page"
      }, React.createElement("label", {
        className: "per-page-control"
      }, React.createElement("span", null, "Show "), React.createElement("select", {
        onChange: this.updatePerPage(props.changeRowsPerPage),
        value: props.rowsPerPage
      }, state.pageOptions.map(function (opt, index) {
        return React.createElement("option", {
          key: index,
          value: opt
        }, opt);
      })), React.createElement("span", null, " entries per page"))), React.createElement("div", {
        className: "transaction-records-pagination"
      }, React.createElement("label", {
        className: "page-control"
      }, React.createElement("span", null, "Page "), React.createElement("input", {
        className: "page-control-slider",
        type: "range",
        min: "1",
        max: maxPages,
        value: state.page,
        onChange: this.updatePage.bind(this)
      }), React.createElement("span", {
        className: "page-control-current"
      }, state.page))), React.createElement("table", null, React.createElement("tbody", null, React.createElement("tr", null, dimensions.map(function (dim, index) {
        return (// Handle toggling between ascending and descending sorting
          // if the current dimension is the defined sort dimension
          React.createElement("th", {
            key: index,
            onClick: this.updateSort(dim.value, dim.value === state.sort.by ? !state.sort.asc : false)
          }, dim.title, " ", dim.value === state.sort.by ? sortArrow : '')
        );
      }.bind(this))), dataView.map(function (row, index) {
        return React.createElement("tr", {
          key: index
        }, dimensions.map(function (dim, index) {
          return React.createElement("td", {
            key: index
          }, row[dim.value]);
        }));
      }))));
    }
  }]);

  return TransactionTable;
}(Component);
var TransactionTable$1 = connector(TransactionTable);

/**
 * Represents fields from props that will be used to display summarized transaction data.
 */

/**
 * Provides a map of types from DataRow to display-friendly strings
 * @type {{summary: string, numPlg: string, total: string, annualTotal: string, numCharges: string, numEFT: string, numPaypal: string}}
 */

var headerDisplayMap = {
  summary: 'Summary',
  numPlg: '#Plg',
  total: 'Total $ Monthly',
  annualTotal: 'Total $ Annually',
  numCharges: '#Charges',
  numEFT: '#EFT',
  numPaypal: '#PayPal'
};
/**
 * Given a number, format it to a string that looks like USD currency.
 * @param value
 * @returns {string}
 */

function formatMoney(value) {
  return '$' + value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}
/**
 * If the key string matches any key from headerDisplayMap whose value needs extra formatting for display,
 * return the formatted value. Works for money fields so far.
 * @param key
 * @param value
 * @returns {*}
 */


function formatForDisplay(key, value) {
  return ['total', 'annualTotal'].indexOf(key) < 0 ? value : formatMoney(value);
}
/**
 * General purpose method to execute an arbitrary function on the fields of a DataRow.
 * @param object
 * @param callback
 * @returns {Array}
 */


function mapObject(object, callback) {
  return Object.keys(object).map(function (key) {
    return callback(key, object[key]);
  });
}
/**
 * This component draws a table of summarized transaction data.
 */


var TransactionTotals =
/*#__PURE__*/
function (_Component) {
  _inherits(TransactionTotals, _Component);

  function TransactionTotals() {
    _classCallCheck(this, TransactionTotals);

    return _possibleConstructorReturn(this, _getPrototypeOf(TransactionTotals).apply(this, arguments));
  }

  _createClass(TransactionTotals, [{
    key: "computeOnetimeData",

    /**
     * Build a DataRow that summarizes one-time donations.
     * @param rows
     * @returns {{summary: string, numPlg: *, total: number, annualTotal: *, numCharges: *, numEFT: *, numPaypal: *}}
     */
    value: function computeOnetimeData(rows) {
      var onetime = rows.filter(function (row) {
        return row.approved === 'Yes' && row.one_time !== null && row.one_time > 0;
      });
      var oneTimeTotal = onetime.reduce(function (a, b) {
        return a + b.one_time;
      }, 0);
      return {
        summary: "One-time",
        numPlg: onetime.reduce(function (a, b) {
          return b.one_time != null ? a + 1 : a;
        }, 0),
        total: 0,
        annualTotal: oneTimeTotal,
        numCharges: onetime.reduce(function (a, b) {
          return b.one_time != null && b.payment_method === 'Credit' ? a + 1 : a;
        }, 0),
        numEFT: onetime.reduce(function (a, b) {
          return b.one_time != null && b.payment_method === 'EFT' ? a + 1 : a;
        }, 0),
        numPaypal: onetime.reduce(function (a, b) {
          return b.one_time != null && b.payment_method === 'Paypal' ? a + 1 : a;
        }, 0)
      };
    }
    /**
     * Build a DataRow that summarizes monthly donations.
     * @param rows
     * @returns {{summary: string, numPlg: *, total: *, annualTotal: number, numCharges: *, numEFT: *, numPaypal: *}}
     */

  }, {
    key: "computeMonthlyData",
    value: function computeMonthlyData(rows) {
      var monthly = rows.filter(function (row) {
        return row.approved === 'Yes' && row.monthly != null && row.monthly > 0;
      });
      var monthlyTotal = monthly.reduce(function (a, b) {
        return a + b.monthly;
      }, 0);
      return {
        summary: "Monthly",
        numPlg: monthly.reduce(function (a, b) {
          return b.monthly != null ? a + 1 : a;
        }, 0),
        total: monthlyTotal,
        annualTotal: monthlyTotal * 12,
        numCharges: monthly.reduce(function (a, b) {
          return b.monthly != null && b.payment_method === 'Credit' ? a + 1 : a;
        }, 0),
        numEFT: monthly.reduce(function (a, b) {
          return b.monthly != null && b.payment_method === 'EFT' ? a + 1 : a;
        }, 0),
        numPaypal: monthly.reduce(function (a, b) {
          return b.monthly != null && b.payment_method === 'Paypal' ? a + 1 : a;
        }, 0)
      };
    }
    /**
     * Sums one-time and monthly donation data
     * @param oneTimeRow
     * @param monthlyRow
     * @returns {{summary: string, numPlg: number, total: number, annualTotal: number, numCharges: number, numEFT: number, numPaypal: number}}
     */

  }, {
    key: "computeTotalData",
    value: function computeTotalData(oneTimeRow, monthlyRow) {
      return {
        summary: "Total",
        numPlg: oneTimeRow.numPlg + monthlyRow.numPlg,
        total: oneTimeRow.total + monthlyRow.total,
        annualTotal: oneTimeRow.annualTotal + monthlyRow.annualTotal,
        numCharges: oneTimeRow.numCharges + monthlyRow.numCharges,
        numEFT: oneTimeRow.numEFT + monthlyRow.numEFT,
        numPaypal: oneTimeRow.numPaypal + monthlyRow.numPaypal
      };
    }
  }, {
    key: "render",
    value: function render() {
      var oneTimeData = this.computeOnetimeData(this.props.rows);
      var monthlyData = this.computeMonthlyData(this.props.rows);
      return React.createElement("table", {
        className: "summary-table"
      }, React.createElement("thead", null, React.createElement("tr", null, Object.keys(headerDisplayMap).map(function (key) {
        return React.createElement("th", {
          key: key
        }, headerDisplayMap[key]);
      }))), React.createElement("tbody", null, React.createElement("tr", null, mapObject(oneTimeData, function (key, value) {
        return React.createElement("td", {
          key: key
        }, formatForDisplay(key, value));
      })), React.createElement("tr", null, mapObject(monthlyData, function (key, value) {
        return React.createElement("td", {
          key: key
        }, formatForDisplay(key, value));
      })), React.createElement("tr", null, mapObject(this.computeTotalData(oneTimeData, monthlyData), function (key, value) {
        return React.createElement("td", {
          key: key
        }, formatForDisplay(key, value));
      }))));
    }
  }]);

  return TransactionTotals;
}(Component);
connector(TransactionTotals);

var TimeRangePicker =
/*#__PURE__*/
function (_Component) {
  _inherits(TimeRangePicker, _Component);

  function TimeRangePicker() {
    _classCallCheck(this, TimeRangePicker);

    return _possibleConstructorReturn(this, _getPrototypeOf(TimeRangePicker).apply(this, arguments));
  }

  _createClass(TimeRangePicker, [{
    key: "changeStartTime",
    value: function changeStartTime(evt) {
      this.changeTime(parseInt(evt.target.value), this.props.startDate, this.props.setStartDate);
    }
  }, {
    key: "changeEndTime",
    value: function changeEndTime(evt) {
      this.changeTime(parseInt(evt.target.value), this.props.endDate, this.props.setEndDate);
    }
  }, {
    key: "changeTime",
    value: function changeTime(minutes, base, action) {
      var time = moment(base);
      time.hours(Math.floor(minutes / 60));
      time.minutes(minutes % 60);
      action(time);
    }
  }, {
    key: "render",
    value: function render() {
      var start = this.props.startDate;
      var end = this.props.endDate;
      return React.createElement("div", {
        className: "timerange-input"
      }, React.createElement("div", null, React.createElement("div", {
        className: "timerange-display"
      }, React.createElement("div", {
        className: "label"
      }, "Start: "), React.createElement("div", {
        className: "selection"
      }, React.createElement("span", {
        className: "time hours"
      }, start.format('hh')), React.createElement("span", {
        className: "separater"
      }, ":"), React.createElement("span", {
        className: "time minutes"
      }, start.format('mm')), React.createElement("span", {
        className: "ampm"
      }, start.format('A')))), React.createElement("input", {
        className: "timerange-slider",
        type: "range",
        min: "0",
        max: "1435",
        step: "5",
        value: start.hours() * 60 + start.minutes(),
        onChange: this.changeStartTime.bind(this)
      })), React.createElement("div", null, React.createElement("div", {
        className: "timerange-display"
      }, React.createElement("div", {
        className: "label"
      }, "End: "), React.createElement("div", {
        className: "selection"
      }, React.createElement("span", {
        className: "time hours"
      }, end.format('hh')), React.createElement("span", {
        className: "separater"
      }, ":"), React.createElement("span", {
        className: "time minutes"
      }, end.format('mm')), React.createElement("span", {
        className: "ampm"
      }, end.format('A')))), React.createElement("input", {
        className: "timerange-slider",
        type: "range",
        min: "0",
        max: "1435",
        step: "5",
        value: end.hours() * 60 + end.minutes(),
        onChange: this.changeEndTime.bind(this)
      })));
    }
  }]);

  return TimeRangePicker;
}(Component);
var TimeRangePicker$1 = connector(TimeRangePicker);

var calculations = [{
  title: '#Plg',
  value: 'count',
  template: function template(val) {
    return val;
  }
}, {
  title: '#Charges',
  value: 'creditcard',
  template: function template(val) {
    return val;
  }
}, {
  title: '#PayPal',
  value: 'paypal',
  template: function template(val) {
    return val;
  }
}, {
  title: '#EFT',
  value: 'eft',
  template: function template(val) {
    return val;
  }
}, {
  title: 'Total:Annual',
  value: 'total',
  template: function template(val) {
    return '$' + val.toFixed(2);
  }
}, {
  title: 'Total:Monthly',
  value: 'monthtotal',
  template: function template(val) {
    return '$' + val.toFixed(2);
  }
}, {
  title: '#Monthly',
  value: 'monthcount',
  template: function template(val) {
    return val;
  }
}, {
  title: 'Total:One Time',
  value: 'onetimetotal',
  template: function template(val) {
    return '$' + val.toFixed(2);
  }
}, {
  title: '#One Time',
  value: 'onetimecount',
  template: function template(val) {
    return val;
  }
}, {
  title: 'Average',
  value: 'total',
  template: function template(val, row) {
    return '$' + (row.total / row.count).toFixed(2);
  }
}, {
  title: 'Max',
  value: 'max',
  template: function template(val) {
    return '$' + val.toFixed(2);
  }
}];
/**
 * Reduce is a function used by react-pivot to compute additional data not
 * initially present in the data set
 *
 * @param {Object} row
 * @param {Object} memo
 * @returns {Object}
 */

var reduce = function reduce(row, memo) {
  function isApproved(val) {
    return row.approved === 'Yes' ? val : 0;
  } // Add a row total (annual)


  memo.total = (memo.total || 0) + isApproved(parseFloat(row.one_time || row.monthly * 12)); // Add a month total

  memo.monthtotal = (memo.monthtotal || 0) + isApproved(parseFloat(row.monthly) || 0); // Add a month count

  memo.monthcount = (memo.monthcount || 0) + isApproved(parseFloat(row.monthly) ? 1 : 0); // Add a month total

  memo.onetimetotal = (memo.onetimetotal || 0) + isApproved(parseFloat(row.one_time) || 0); // Add a one time count

  memo.onetimecount = (memo.onetimecount || 0) + isApproved(parseFloat(row.one_time) ? 1 : 0); // Add a record count

  memo.count = (memo.count || 0) + isApproved(1); // Add a record max

  memo.max = Math.max(memo.max || 0, isApproved(parseFloat(row.one_time || row.monthly * 12)));
  memo.creditcard = (memo.creditcard || 0) + isApproved(row.payment_method === 'Credit' ? 1 : 0);
  memo.paypal = (memo.paypal || 0) + isApproved(row.payment_method === 'Paypal' ? 1 : 0);
  memo.eft = (memo.eft || 0) + isApproved(row.payment_method === 'EFT' ? 1 : 0);
  return memo;
};
/**
 * A reference to a pivot table
 *
 * @param {Object} ref
 */


var pivotRefToProps = function serializePivot(ref) {
  // Serialize the ref state into a storable form
  var storable = {};
  ['dimensions', 'sortBy', 'sortDir', 'hiddenColumns', 'solo'].forEach(function (key) {
    storable[key] = ref.state[key];
  });
  return storable;
};

var TransactionReport =
/*#__PURE__*/
function (_Component) {
  _inherits(TransactionReport, _Component);

  function TransactionReport(props) {
    var _this;

    _classCallCheck(this, TransactionReport);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TransactionReport).call(this, props));
    _this.state = {
      pivots: {},
      pivotPageSizes: [5, 10, 25, 50, 100],
      defaultPivotPageSize: 25,
      updateInterval: null,
      rate: 30000,
      saveInterval: null
    };
    return _this;
  }

  _createClass(TransactionReport, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      // When the App starts up, perform an initial data request then
      // boot the data refresher
      this.props.loadFields();
      this.props.fetchData();
      this.props.loadProfile().then(function () {
        _this2.setState(function () {
          return {
            saveInterval: setInterval(function () {
              this.storeState();
            }.bind(_this2), 10000)
          };
        });
      });
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps() {
      var props = this.props; // Determine a rate for which to refresh the dataset

      var rate = 30000; // A faster refresh rate is only needed when the end date is in the future

      if (props.endDate.valueOf() > Date.now()) {
        rate = this.computeRefreshFrequency(Date.now() - Math.min(Date.now(), props.startDate.valueOf()));
      }

      if (rate !== this.state.rate) {
        clearInterval(this.state.updateInterval);
        var intervalId = setInterval(function () {
          props.fetchData();
        }, rate);
        this.setState({
          rate: rate,
          updateInterval: intervalId
        });
      }
    }
  }, {
    key: "updatePivotRef",
    value: function updatePivotRef(uuid$$1, ref) {
      if (!this.state.pivots[uuid$$1]) {
        var newPivotState = this.state.pivots;
        newPivotState[uuid$$1] = ref;
        this.setState({
          pivots: newPivotState
        });
      }
    }
  }, {
    key: "updatePivotRows",
    value: function updatePivotRows(uuid$$1, action) {
      return function (event) {
        action({
          'uuid': uuid$$1,
          'numRows': event.target.value | 0
        });
      };
    }
  }, {
    key: "addNewPivotView",
    value: function addNewPivotView(action) {
      var pivotPageSize = this.state.defaultPivotPageSize;
      return function (event) {
        action({
          'uuid': uuid(),
          'numRows': pivotPageSize
        });
      };
    }
  }, {
    key: "storeState",
    value: function storeState() {
      var pivotState = Object.assign({}, this.state.pivots);

      for (var _uuid in pivotState) {
        if (pivotState.hasOwnProperty(_uuid) && typeof this.props.pivots[_uuid] !== 'undefined') {
          pivotState[_uuid] = pivotRefToProps(pivotState[_uuid]);
          pivotState[_uuid].numRows = this.props.pivots[_uuid].numRows;
        }
      }

      var toStore = {
        filters: this.props.filters.slice().map(function (filter) {
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
      this.setState({
        pivots: {}
      });
    }
    /**
     * Computes the frequency at which the reports should fetch information
     * from the server. Smaller reporting windows query at a faster rate, and
     * larger windows query at a slower rate
     *
     * @param {int} reportWindow The number of milliseconds that the reporting
     *                           window of covers
     */

  }, {
    key: "computeRefreshFrequency",
    value: function computeRefreshFrequency(reportWindow) {
      var oneDay = 86400000;
      return Math.max(5, Math.min(30, Math.ceil(reportWindow / oneDay) * 5)) * 1000;
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var data = []; // Create scoped variable to make maps less tedious

      var props = this.props;

      if (props.filterMethod === 'advanced') {
        var filter = generateFilterFn(props.advancedFilters);
        data = filter(props.rows);
      } else {
        // If there are no filters set, then the full data set should be shown
        if (props.filters.length === 0) {
          data = props.rows;
        } else {
          // If the filter method is additive, then accept any record that satisfies
          // one or more filters
          if (props.filterMethod === 'additive') {
            data = props.rows.filter(function (point) {
              return props.filters.reduce(function (include, filter) {
                return include || filter.fn(point);
              }, false);
            });
          } else {
            // Otherwise only accept rows that match all of the filters
            data = props.filters.reduce(function (data, filter) {
              return data.filter(filter.fn);
            }, props.rows);
          }
        }
      }

      var pivotUpdate = this.updatePivotRef.bind(this);
      return React.createElement("div", {
        className: "transaction-viewer"
      }, React.createElement("div", {
        className: "transaction-filters"
      }, React.createElement("div", {
        className: "transaction-date-filters"
      }, React.createElement("h3", null, "Date Range"), React.createElement(DateManager$1, null)), React.createElement("div", {
        className: "transaction-time-filters"
      }, React.createElement("h3", null, "Time Range"), React.createElement(TimeRangePicker$1, null)), React.createElement("div", {
        className: "transaction-field-filters"
      }, React.createElement("h3", null, "Filters"), React.createElement(FilterManager$1, null))), React.createElement("div", {
        className: "transaction-viewer-data"
      }, React.createElement("h3", null, "Records"), React.createElement(TransactionTable$1, {
        data: data
      }), React.createElement("h3", null, "Pivot Views"), React.createElement("ul", {
        className: "transaction-pivot-views"
      }, Object.keys(props.pivots).map(function (uuid$$1, index) {
        var remove = React.createElement("button", {
          className: "transaction-pivot-remove",
          onClick: function onClick() {
            return props.removePivotView(uuid$$1);
          }
        }, "Remove View");
        return React.createElement("li", {
          key: uuid$$1
        }, React.createElement("div", null, React.createElement("h4", null, "View ", index + 1, " ", remove)), React.createElement("div", {
          className: "transaction-records-per-page"
        }, React.createElement("label", {
          className: "per-page-control"
        }, React.createElement("span", null, "Show "), React.createElement("select", {
          onChange: _this3.updatePivotRows(uuid$$1, props.changeRowsPerPivot),
          value: props.pivots[uuid$$1].numRows
        }, _this3.state.pivotPageSizes.map(function (opt, index) {
          return React.createElement("option", {
            key: index,
            value: opt
          }, opt);
        })), React.createElement("span", null, " rows per page"))), React.createElement("div", {
          className: "transaction-pivot-table"
        }, React.createElement(ReactPivot, {
          ref: function ref(_ref) {
            return pivotUpdate(uuid$$1, _ref);
          },
          rows: data,
          dimensions: props.dimensions,
          reduce: reduce,
          calculations: props.calculations || calculations,
          hiddenColumns: props.pivots[uuid$$1].hiddenColumns || ['Average', 'Max'],
          activeDimensions: props.pivots[uuid$$1].dimensions,
          nPaginateRows: props.pivots[uuid$$1].numRows
        })));
      })), React.createElement("div", {
        className: "transaction-pivot-table-add"
      }, React.createElement("button", {
        onClick: this.addNewPivotView(props.addPivotView)
      }, " Add New Pivot View "))));
    }
  }]);

  return TransactionReport;
}(Component);

var TransactionReport$1 = connector(TransactionReport);

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".transaction-viewer {\n  overflow: visible;\n}\n\n.transaction-filter-controls,\n.transaction-date-controls,\n.transaction-records {\n  padding: 4px 8px;\n  overflow: auto;\n}\n\n.transaction-filter-list {\n  margin-bottom: 0;\n  overflow: auto;\n}\n\n.transaction-filter {\n  float: left;\n  margin-bottom: 0;\n  margin-left: 4px;\n  padding: 4px 8px;\n  background: #ccc;\n  border-radius: 25px;\n  overflow: auto;\n}\n\n.transaction-filter-label-type {\n  color: #333;\n  font-weight: bold;\n}\n\n.transaction-filter-delete {\n  margin: 0px -4px 0px 8px;\n  padding: 2px 6px;\n  background: #555;\n  border-radius: 25px;\n  color: #f7f7f7;\n  text-transform: uppercase;\n  cursor: pointer;\n}\n\n.transaction-viewer button {\n  background-color: #FFF;\n  border: 1px solid #CCC;\n  height: 28px;\n  color: #555;\n  cursor: pointer;\n  padding: 0 10px;\n  border-radius: 4px;\n  margin-top: 5px;\n}\n\n.transaction-filters td {\n  vertical-align: middle;\n}\n\n.transaction-viewer .transaction-filter-add {\n  margin: 0 0 0 5px;\n  vertical-align: middle;\n}\n\n.transaction-viewer .reactPivot {\n  margin: 2px;\n}\n\n.transaction-pivot-remove {\n  font-weight: normal;\n}\n\n.transaction-pivot-views {\n  margin: 0;\n}\n\n.transaction-pivot-table-add {\n  text-align: center;\n}\n\n.transaction-records-per-page {\n  float: left;\n}\n\n.per-page-control {\n  vertical-align: middle;\n}\n\n.transaction-records-pagination {\n  float: right;\n}\n\n.page-control {\n  vertical-align: middle;\n}\n\n.page-control-slider {\n  vertical-align: middle;\n}\n\n.page-control-current {\n  margin-left: 4px;\n  padding: 2px 16px;\n  background-color: #eee;\n}\n\n.transaction-records table {\n  width: 100%;\n  clear: both;\n  text-align: left;\n  border-spacing: 0;\n}\n\n.transaction-sort-asc {\n  position: absolute;\n  top: calc(50%);\n  left: 0;\n  width: 0;\n  height: 0;\n  border-left: 4px solid transparent;\n  border-right: 4px solid transparent;\n  border-top: 8px solid #000;\n}\n\n.transaction-sort-desc {\n  position: absolute;\n  top: calc(50% - 8px);\n  left: 0;\n  width: 0;\n  height: 0;\n  border-left: 4px solid transparent;\n  border-right: 4px solid transparent;\n  border-bottom: 8px solid #000;\n}\n\n.transaction-records th.asc:after,\n.transaction-records th.desc:after {\n  font-size: 50%;\n  opacity: 0.5;\n}\n\n.transaction-records th.asc:after { content: ' ▲' }\n.transaction-records th.desc:after { content: ' ▼' }\n\n.transaction-records th {\n  position: relative;\n  padding: 8px 6px 8px 10px;\n}\n\n.transaction-records td {\n  border-top: 1px solid #ddd;\n  padding: 8px;\n}\n\n.transaction-records td.reactPivot-indent {\n  border: none;\n}\n\n.transaction-records tr:hover td {\n  background: #f5f5f5\n}\n\n.transaction-records tr:hover td.reactPivot-indent {\n  background: none;\n}\n\n.filter-overlay-wrapper {\n  position: absolute;\n  background: rgba(0,0,0,0.3);\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: flex-start;\n  z-index: 99999;\n\n  .filter-overlay {\n    position: relative;\n    margin: 150px auto 0;\n    max-width: 80%;\n    overflow: auto;\n    background-color: #FFF;\n    padding: 10px;\n    min-width: 600px;\n\n    .filter-overlay-close {\n      float: right;\n      color: #ff0000;\n      font-size: 2em;\n      cursor: pointer;\n    }\n\n    .filter-group {\n      width: inherit;\n      float: none;\n      padding: 10px;\n    }\n\n    .filter-group-condition {\n      display: inline-block;\n      margin-left: 14px;\n      color: grey;\n      font-size: 1.2em;\n      text-transform: uppercase;\n      vertical-align: middle;\n    }\n\n    .filter-remove i {\n      font-size: 1.5em;\n      vertical-align: middle;\n      margin-left: 5px;\n    }\n\n    .group-separate {\n      margin-top: 14px;\n      border-top: 3px solid green;\n\n      h3 {\n        margin: -10px 0 0 20px;\n        line-height: 20px;\n\n        span {\n          background-color: #FFF;\n          padding: 0 3px;\n        }\n      }\n    }\n  }\n}\n\n.DateRangePicker button {\n  background: transparent;\n  border: 0;\n}\n\n.timerange-display {\n  margin: 8px 0;\n\n  .label, .time, .separater, .ampm {\n    font-size: 18px;\n    display: inline-block;\n  }\n\n  .label {\n    float: left;\n  }\n\n  .selection {\n    float: right;\n  }\n\n}\n\n.timerange-slider {\n  width: 100%;\n  padding: 8px;\n}\n\n.CalendarDay {\n  border: 1px solid #e4e7e7;\n  padding: 0;\n  box-sizing: border-box;\n  color: #565a5c;\n  cursor: pointer; }\n\n.CalendarDay__button {\n  position: relative;\n  height: 100%;\n  width: 100%;\n  text-align: center;\n  background: none;\n  border: 0;\n  margin: 0;\n  padding: 0;\n  color: inherit;\n  font: inherit;\n  line-height: normal;\n  overflow: visible;\n  cursor: pointer;\n  box-sizing: border-box; }\n.CalendarDay__button:active {\n  outline: 0; }\n\n.CalendarDay--highlighted-calendar {\n  background: #ffe8bc;\n  color: #565a5c;\n  cursor: default; }\n.CalendarDay--highlighted-calendar:active {\n  background: #007a87; }\n\n.CalendarDay--outside {\n  border: 0;\n  cursor: default; }\n.CalendarDay--outside:active {\n  background: #fff; }\n\n.CalendarDay--hovered {\n  background: #e4e7e7;\n  border: 1px double #d4d9d9;\n  color: inherit; }\n\n.CalendarDay--blocked-minimum-nights {\n  color: #cacccd;\n  background: #fff;\n  border: 1px solid #e4e7e7;\n  cursor: default; }\n.CalendarDay--blocked-minimum-nights:active {\n  background: #fff; }\n\n.CalendarDay--selected-span {\n  background: #66e2da;\n  border: 1px double #33dacd;\n  color: #fff; }\n.CalendarDay--selected-span.CalendarDay--hovered, .CalendarDay--selected-span:active {\n  background: #33dacd;\n  border: 1px double #00a699; }\n.CalendarDay--selected-span.CalendarDay--last-in-range {\n  border-right: #00a699; }\n\n.CalendarDay--hovered-span,\n.CalendarDay--after-hovered-start {\n  background: #b2f1ec;\n  border: 1px double #80e8e0;\n  color: #007a87; }\n.CalendarDay--hovered-span:active,\n.CalendarDay--after-hovered-start:active {\n  background: #80e8e0; }\n\n.CalendarDay--selected-start,\n.CalendarDay--selected-end,\n.CalendarDay--selected {\n  background: #00a699;\n  border: 1px double #00a699;\n  color: #fff; }\n.CalendarDay--selected-start:active,\n.CalendarDay--selected-end:active,\n.CalendarDay--selected:active {\n  background: #00a699; }\n\n.CalendarDay--blocked-calendar {\n  background: #cacccd;\n  color: #82888a;\n  cursor: default; }\n.CalendarDay--blocked-calendar:active {\n  background: #cacccd; }\n\n.CalendarDay--blocked-out-of-range {\n  color: #cacccd;\n  background: #fff;\n  border: 1px solid #e4e7e7;\n  cursor: default; }\n.CalendarDay--blocked-out-of-range:active {\n  background: #fff; }\n\n.CalendarMonth {\n  text-align: center;\n  padding: 0 13px;\n  vertical-align: top;\n  -moz-user-select: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n.CalendarMonth table {\n  border-collapse: collapse;\n  border-spacing: 0;\n  caption-caption-side: initial; }\n\n.CalendarMonth--horizontal:first-of-type,\n.CalendarMonth--vertical:first-of-type {\n  position: absolute;\n  z-index: -1;\n  opacity: 0;\n  pointer-events: none; }\n\n.CalendarMonth--horizontal {\n  display: inline-block;\n  min-height: 100%; }\n\n.CalendarMonth--vertical {\n  display: block; }\n\n.CalendarMonth__caption {\n  color: #3c3f40;\n  margin-top: 7px;\n  font-size: 18px;\n  text-align: center;\n  margin-bottom: 2px;\n  caption-side: initial; }\n\n.CalendarMonth--horizontal .CalendarMonth__caption,\n.CalendarMonth--vertical .CalendarMonth__caption {\n  padding: 15px 0 35px; }\n\n.CalendarMonth--vertical-scrollable .CalendarMonth__caption {\n  padding: 5px 0; }\n\n.CalendarMonthGrid {\n  background: #fff;\n  z-index: 0;\n  text-align: left; }\n\n.CalendarMonthGrid--animating {\n  -webkit-transition: -webkit-transform 0.2s ease-in-out;\n  -moz-transition: -moz-transform 0.2s ease-in-out;\n  transition: transform 0.2s ease-in-out;\n  z-index: 1; }\n\n.CalendarMonthGrid--horizontal {\n  position: absolute;\n  left: 9px; }\n\n.CalendarMonthGrid--vertical {\n  margin: 0 auto; }\n\n.CalendarMonthGrid--vertical-scrollable {\n  margin: 0 auto;\n  overflow-y: scroll; }\n\n.DayPicker {\n  background: #fff;\n  position: relative;\n  text-align: left; }\n\n.DayPicker--horizontal {\n  background: #fff;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.07);\n  border-radius: 3px; }\n.DayPicker--horizontal.DayPicker--portal {\n  box-shadow: none;\n  position: absolute;\n  left: 50%;\n  top: 50%; }\n\n.DayPicker--vertical.DayPicker--portal {\n  position: initial; }\n\n.DayPicker__focus-region {\n  outline: none; }\n\n.DayPicker__week-headers {\n  position: relative; }\n\n.DayPicker--horizontal .DayPicker__week-headers {\n  margin-left: 9px; }\n\n.DayPicker__week-header {\n  color: #757575;\n  position: absolute;\n  top: 62px;\n  z-index: 2;\n  padding: 0 13px;\n  text-align: left; }\n.DayPicker__week-header ul {\n  list-style: none;\n  margin: 1px 0;\n  padding-left: 0;\n  padding-right: 0; }\n.DayPicker__week-header li {\n  display: inline-block;\n  text-align: center; }\n\n.DayPicker--vertical .DayPicker__week-header {\n  left: 50%; }\n\n.DayPicker--vertical-scrollable {\n  height: 100%; }\n.DayPicker--vertical-scrollable .DayPicker__week-header {\n  top: 0;\n  display: table-row;\n  border-bottom: 1px solid #dbdbdb;\n  background: white; }\n.DayPicker--vertical-scrollable .transition-container--vertical {\n  padding-top: 20px;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  overflow-y: scroll; }\n.DayPicker--vertical-scrollable .DayPicker__week-header {\n  margin-left: 0;\n  left: 0;\n  width: 100%;\n  text-align: center; }\n\n.transition-container {\n  position: relative;\n  overflow: hidden;\n  border-radius: 3px; }\n\n.transition-container--horizontal {\n  transition: height 0.2s ease-in-out; }\n\n.transition-container--vertical {\n  width: 100%; }\n\n.DayPickerNavigation__prev,\n.DayPickerNavigation__next {\n  cursor: pointer;\n  line-height: 0.78;\n  -webkit-user-select: none;\n  /* Chrome/Safari */\n  -moz-user-select: none;\n  /* Firefox */\n  -ms-user-select: none;\n  /* IE10+ */\n  user-select: none; }\n\n.DayPickerNavigation__prev--default,\n.DayPickerNavigation__next--default {\n  border: 1px solid #dce0e0;\n  background-color: #fff;\n  color: #757575; }\n.DayPickerNavigation__prev--default:focus, .DayPickerNavigation__prev--default:hover,\n.DayPickerNavigation__next--default:focus,\n.DayPickerNavigation__next--default:hover {\n  border: 1px solid #c4c4c4; }\n.DayPickerNavigation__prev--default:active,\n.DayPickerNavigation__next--default:active {\n  background: #f2f2f2; }\n\n.DayPickerNavigation--horizontal {\n  position: relative; }\n.DayPickerNavigation--horizontal .DayPickerNavigation__prev,\n.DayPickerNavigation--horizontal .DayPickerNavigation__next {\n  border-radius: 3px;\n  padding: 6px 9px;\n  top: 18px;\n  z-index: 2;\n  position: absolute; }\n.DayPickerNavigation--horizontal .DayPickerNavigation__prev {\n  left: 22px; }\n.DayPickerNavigation--horizontal .DayPickerNavigation__prev--rtl {\n  left: auto;\n  right: 22px; }\n.DayPickerNavigation--horizontal .DayPickerNavigation__next {\n  right: 22px; }\n.DayPickerNavigation--horizontal .DayPickerNavigation__next--rtl {\n  right: auto;\n  left: 22px; }\n.DayPickerNavigation--horizontal .DayPickerNavigation__prev--default svg,\n.DayPickerNavigation--horizontal .DayPickerNavigation__next--default svg {\n  height: 19px;\n  width: 19px;\n  fill: #82888a; }\n\n.DayPickerNavigation--vertical {\n  background: #fff;\n  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  height: 52px;\n  width: 100%;\n  z-index: 2; }\n.DayPickerNavigation--vertical .DayPickerNavigation__prev,\n.DayPickerNavigation--vertical .DayPickerNavigation__next {\n  display: inline-block;\n  position: relative;\n  height: 100%;\n  width: 50%; }\n.DayPickerNavigation--vertical .DayPickerNavigation__next--default {\n  border-left: 0; }\n.DayPickerNavigation--vertical .DayPickerNavigation__prev--default,\n.DayPickerNavigation--vertical .DayPickerNavigation__next--default {\n  text-align: center;\n  font-size: 2.5em;\n  padding: 5px; }\n.DayPickerNavigation--vertical .DayPickerNavigation__prev--default svg,\n.DayPickerNavigation--vertical .DayPickerNavigation__next--default svg {\n  height: 42px;\n  width: 42px;\n  fill: #484848; }\n\n.DayPickerNavigation--vertical-scrollable {\n  position: relative; }\n.DayPickerNavigation--vertical-scrollable .DayPickerNavigation__next {\n  width: 100%; }\n\n.DayPickerKeyboardShortcuts__show,\n.DayPickerKeyboardShortcuts__close {\n  background: none;\n  border: 0;\n  color: inherit;\n  font: inherit;\n  line-height: normal;\n  overflow: visible;\n  padding: 0;\n  cursor: pointer; }\n.DayPickerKeyboardShortcuts__show:active,\n.DayPickerKeyboardShortcuts__close:active {\n  outline: none; }\n\n.DayPickerKeyboardShortcuts__show {\n  width: 22px;\n  position: absolute;\n  z-index: 2; }\n\n.DayPickerKeyboardShortcuts__show--bottom-right {\n  border-top: 26px solid transparent;\n  border-right: 33px solid #00a699;\n  bottom: 0;\n  right: 0; }\n.DayPickerKeyboardShortcuts__show--bottom-right:hover {\n  border-right: 33px solid #008489; }\n.DayPickerKeyboardShortcuts__show--bottom-right .DayPickerKeyboardShortcuts__show_span {\n  bottom: 0;\n  right: -28px; }\n\n.DayPickerKeyboardShortcuts__show--top-right {\n  border-bottom: 26px solid transparent;\n  border-right: 33px solid #00a699;\n  top: 0;\n  right: 0; }\n.DayPickerKeyboardShortcuts__show--top-right:hover {\n  border-right: 33px solid #008489; }\n.DayPickerKeyboardShortcuts__show--top-right .DayPickerKeyboardShortcuts__show_span {\n  top: 1px;\n  right: -28px; }\n\n.DayPickerKeyboardShortcuts__show--top-left {\n  border-bottom: 26px solid transparent;\n  border-left: 33px solid #00a699;\n  top: 0;\n  left: 0; }\n.DayPickerKeyboardShortcuts__show--top-left:hover {\n  border-left: 33px solid #008489; }\n.DayPickerKeyboardShortcuts__show--top-left .DayPickerKeyboardShortcuts__show_span {\n  top: 1px;\n  left: -28px; }\n\n.DayPickerKeyboardShortcuts__show_span {\n  color: #fff;\n  position: absolute; }\n\n.DayPickerKeyboardShortcuts__panel {\n  overflow: auto;\n  background: #fff;\n  border: 1px solid #dbdbdb;\n  border-radius: 2px;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  z-index: 2;\n  padding: 22px;\n  margin: 33px; }\n\n.DayPickerKeyboardShortcuts__title {\n  font-size: 16px;\n  font-weight: bold;\n  margin: 0; }\n\n.DayPickerKeyboardShortcuts__list {\n  list-style: none;\n  padding: 0; }\n\n.DayPickerKeyboardShortcuts__close {\n  position: absolute;\n  right: 22px;\n  top: 22px;\n  z-index: 2; }\n.DayPickerKeyboardShortcuts__close svg {\n  height: 15px;\n  width: 15px;\n  fill: #cacccd; }\n.DayPickerKeyboardShortcuts__close svg:hover, .DayPickerKeyboardShortcuts__close svg:focus {\n  fill: #82888a; }\n.DayPickerKeyboardShortcuts__close:active {\n  outline: none; }\n\n.KeyboardShortcutRow {\n  margin: 6px 0; }\n\n.KeyboardShortcutRow__key-container {\n  display: inline-block;\n  white-space: nowrap;\n  text-align: right;\n  margin-right: 6px; }\n\n.KeyboardShortcutRow__key {\n  font-family: monospace;\n  font-size: 12px;\n  text-transform: uppercase;\n  background: #f2f2f2;\n  padding: 2px 6px; }\n\n.KeyboardShortcutRow__action {\n  display: inline;\n  word-break: break-word;\n  margin-left: 8px; }\n\n.DayPickerKeyboardShortcuts__panel--block .KeyboardShortcutRow {\n  margin-bottom: 16px; }\n\n.DayPickerKeyboardShortcuts__panel--block .KeyboardShortcutRow__key-container {\n  width: auto;\n  text-align: left;\n  display: inline; }\n\n.DayPickerKeyboardShortcuts__panel--block .KeyboardShortcutRow__action {\n  display: inline; }\n\n.DateInput {\n  font-weight: 200;\n  font-size: 18px;\n  line-height: 24px;\n  color: #757575;\n  margin: 0;\n  padding: 8px;\n  background: #fff;\n  position: relative;\n  display: inline-block;\n  width: 130px;\n  vertical-align: middle; }\n\n.DateInput--with-caret::before,\n.DateInput--with-caret::after {\n  content: \"\";\n  display: inline-block;\n  position: absolute;\n  bottom: auto;\n  border: 10px solid transparent;\n  border-top: 0;\n  left: 22px;\n  z-index: 2; }\n\n.DateInput--with-caret::before {\n  top: 62px;\n  border-bottom-color: rgba(0, 0, 0, 0.1); }\n\n.DateInput--with-caret::after {\n  top: 63px;\n  border-bottom-color: #fff; }\n\n.DateInput--disabled {\n  background: #cacccd; }\n\n.DateInput__input {\n  opacity: 0;\n  position: absolute;\n  top: 0;\n  left: 0;\n  border: 0;\n  height: 100%;\n  width: 100%; }\n.DateInput__input[readonly] {\n  -moz-user-select: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.DateInput__display-text {\n  padding: 4px 8px;\n  white-space: nowrap;\n  overflow: hidden; }\n\n.DateInput__display-text--has-input {\n  color: #484848; }\n\n.DateInput__display-text--focused {\n  background: #99ede6;\n  border-color: #99ede6;\n  border-radius: 3px;\n  color: #007a87; }\n\n.DateInput__display-text--disabled {\n  font-style: italic; }\n\n.screen-reader-only {\n  border: 0;\n  clip: rect(0, 0, 0, 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px; }\n\n.DateRangePicker {\n  position: relative;\n  display: inline-block; }\n\n.DateRangePicker__picker {\n  z-index: 1;\n  background-color: #fff;\n  position: absolute;\n  top: 72px; }\n\n.DateRangePicker__picker--rtl {\n  direction: rtl; }\n\n.DateRangePicker__picker--direction-left {\n  left: 0; }\n\n.DateRangePicker__picker--direction-right {\n  right: 0; }\n\n.DateRangePicker__picker--portal {\n  background-color: rgba(0, 0, 0, 0.3);\n  position: fixed;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%; }\n\n.DateRangePicker__picker--full-screen-portal {\n  background-color: #fff; }\n\n.DateRangePicker__close {\n  background: none;\n  border: 0;\n  color: inherit;\n  font: inherit;\n  line-height: normal;\n  overflow: visible;\n  padding: 0;\n  cursor: pointer;\n  position: absolute;\n  top: 0;\n  right: 0;\n  padding: 15px;\n  z-index: 2; }\n.DateRangePicker__close svg {\n  height: 15px;\n  width: 15px;\n  fill: #cacccd; }\n.DateRangePicker__close:hover, .DateRangePicker__close:focus {\n  color: #b0b3b4;\n  text-decoration: none; }\n\n.DateRangePickerInput {\n  background-color: #fff;\n  border: 1px solid #cacccd;\n  display: inline-block; }\n\n.DateRangePickerInput--disabled {\n  background: #cacccd; }\n\n.DateRangePickerInput--rtl {\n  direction: rtl; }\n\n.DateRangePickerInput__arrow {\n  display: inline-block;\n  vertical-align: middle; }\n\n.DateRangePickerInput__arrow svg {\n  vertical-align: middle;\n  fill: #484848;\n  height: 24px;\n  width: 24px; }\n\n.DateRangePickerInput__clear-dates {\n  background: none;\n  border: 0;\n  color: inherit;\n  font: inherit;\n  line-height: normal;\n  overflow: visible;\n  cursor: pointer;\n  display: inline-block;\n  vertical-align: middle;\n  padding: 10px;\n  margin: 0 10px 0 5px; }\n\n.DateRangePickerInput__clear-dates svg {\n  fill: #82888a;\n  height: 12px;\n  width: 15px;\n  vertical-align: middle; }\n\n.DateRangePickerInput__clear-dates--hide {\n  visibility: hidden; }\n\n.DateRangePickerInput__clear-dates:focus,\n.DateRangePickerInput__clear-dates--hover {\n  background: #dbdbdb;\n  border-radius: 50%; }\n\n.DateRangePickerInput__calendar-icon {\n  background: none;\n  border: 0;\n  color: inherit;\n  font: inherit;\n  line-height: normal;\n  overflow: visible;\n  cursor: pointer;\n  display: inline-block;\n  vertical-align: middle;\n  padding: 10px;\n  margin: 0 5px 0 10px; }\n.DateRangePickerInput__calendar-icon svg {\n  fill: #82888a;\n  height: 15px;\n  width: 14px;\n  vertical-align: middle; }\n\n.SingleDatePicker {\n  position: relative;\n  display: inline-block; }\n\n.SingleDatePicker__picker {\n  z-index: 1;\n  background-color: #fff;\n  position: absolute;\n  top: 72px; }\n\n.SingleDatePicker__picker--rtl {\n  direction: rtl; }\n\n.SingleDatePicker__picker--direction-left {\n  left: 0; }\n\n.SingleDatePicker__picker--direction-right {\n  right: 0; }\n\n.SingleDatePicker__picker--portal {\n  background-color: rgba(0, 0, 0, 0.3);\n  position: fixed;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%; }\n\n.SingleDatePicker__picker--full-screen-portal {\n  background-color: #fff; }\n\n.SingleDatePicker__close {\n  background: none;\n  border: 0;\n  color: inherit;\n  font: inherit;\n  line-height: normal;\n  overflow: visible;\n  padding: 0;\n  cursor: pointer;\n  position: absolute;\n  top: 0;\n  right: 0;\n  padding: 15px;\n  z-index: 2; }\n.SingleDatePicker__close svg {\n  height: 15px;\n  width: 15px;\n  fill: #cacccd; }\n.SingleDatePicker__close:hover, .SingleDatePicker__close:focus {\n  color: #b0b3b4;\n  text-decoration: none; }\n\n.SingleDatePickerInput {\n  background-color: #fff;\n  border: 1px solid #dbdbdb; }\n\n.SingleDatePickerInput--rtl {\n  direction: rtl; }\n\n.SingleDatePickerInput__clear-date {\n  background: none;\n  border: 0;\n  color: inherit;\n  font: inherit;\n  line-height: normal;\n  overflow: visible;\n  cursor: pointer;\n  display: inline-block;\n  vertical-align: middle;\n  padding: 10px;\n  margin: 0 10px 0 5px; }\n\n.SingleDatePickerInput__clear-date svg {\n  fill: #82888a;\n  height: 12px;\n  width: 15px;\n  vertical-align: middle; }\n\n.SingleDatePickerInput__clear-date--hide {\n  visibility: hidden; }\n\n.SingleDatePickerInput__clear-date:focus,\n.SingleDatePickerInput__clear-date--hover {\n  background: #dbdbdb;\n  border-radius: 50%; }\n\n.SingleDatePickerInput__calendar-icon {\n  background: none;\n  border: 0;\n  color: inherit;\n  font: inherit;\n  line-height: normal;\n  overflow: visible;\n  cursor: pointer;\n  display: inline-block;\n  vertical-align: middle;\n  padding: 10px;\n  margin: 0 5px 0 10px; }\n.SingleDatePickerInput__calendar-icon svg {\n  fill: #82888a;\n  height: 15px;\n  width: 14px;\n  vertical-align: middle; }\n\n// Pivot Table\n.reactPivot-level-0 {\n  background-color: #ddd;\n}";
styleInject(css);

var TransactionViewerInner =
/*#__PURE__*/
function (_Component) {
  _inherits(TransactionViewerInner, _Component);

  function TransactionViewerInner() {
    _classCallCheck(this, TransactionViewerInner);

    return _possibleConstructorReturn(this, _getPrototypeOf(TransactionViewerInner).apply(this, arguments));
  }

  _createClass(TransactionViewerInner, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.setConfig({
        endpoints: {
          fields: this.props.fieldsEndpoint || '',
          profile: this.props.profileEndpoint || '',
          transactions: this.props.transactionsEndpoint || ''
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          _this$props$config$en = _this$props.config.endpoints,
          fields = _this$props$config$en.fields,
          profile = _this$props$config$en.profile,
          transactions = _this$props$config$en.transactions,
          calculations = _this$props.calculations;

      if (fields && profile && transactions) {
        return React.createElement(TransactionReport$1, {
          calculations: calculations
        });
      } else {
        return null;
      }
    }
  }]);

  return TransactionViewerInner;
}(Component);

var TView = connector(TransactionViewerInner);

var TransactionViewer =
/*#__PURE__*/
function (_Component2) {
  _inherits(TransactionViewer, _Component2);

  function TransactionViewer() {
    _classCallCheck(this, TransactionViewer);

    return _possibleConstructorReturn(this, _getPrototypeOf(TransactionViewer).apply(this, arguments));
  }

  _createClass(TransactionViewer, [{
    key: "render",
    value: function render() {
      return React.createElement(Provider, {
        store: store
      }, React.createElement(TView, {
        calculations: this.props.calculations || null,
        fieldsEndpoint: this.props.fieldsEndpoint,
        profileEndpoint: this.props.profileEndpoint,
        transactionsEndpoint: this.props.transactionsEndpoint
      }));
    }
  }]);

  return TransactionViewer;
}(Component);

export default TransactionViewer;
