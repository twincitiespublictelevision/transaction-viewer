import React, { Component } from 'react';
import Filter from './Filter.jsx';
import FilterList from './FilterList.jsx';
import { connector } from '../store';

let uuid = require('uuid/v4');

class FilterManager extends Component {
  constructor(props) {
    super(props);

    // Component keeps track of its own in progress state
    this.state = {
      createType: '',
      createValue: '',
      createLabel: '',
      createDisabled: true,
      showAdvancedFilters: false
    };
  }

  updateFilterValue(event) {
    this.setState({
      createValue: event.target.value,
      createDisabled: this.state.createType === '' || event.target.value === ''
    });
  }

  updateFilterType(event) {
    let select = event.target;
    this.setState({
      createType: select.value,
      createLabel: select.options[select.selectedIndex].innerHTML,
      createDisabled: select.value === '' || this.state.createValue === ''
    })
  }

  createFilter(action) {
    return function() {
      let filterType = this.state.createType;
      let filterValue = this.state.createValue;

      // Emit the create filter action based on the internal state of the
      // component
      action({
        type: filterType,
        typeLabel: this.state.createLabel,
        value: filterValue,
        fn: function filter(input) {
          let point = input[filterType] !== null ? input[filterType] : '';

          // Transform the record data point to a string and perform a simple
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

  changeFilterMode(event) {
    this.props.setFilterMode(event.target.value);
  }

  openAdvancedFilters() {
    this.setState({
      showAdvancedFilters: true
    });
  }

  closeAdvancedFilters(e) {
    this.setState({
      showAdvancedFilters: false
    })
  }

  renderAdvancedFiltersInput() {
    return <tbody className="advanced-filters">
      <tr>
        <td>
          {
            this.props.filterMethod === 'advanced' &&
            <button className="transaction-filter-add"
                    onClick={this.openAdvancedFilters.bind(this)}>
              Advanced Filters
            </button>
          }
        </td>
      </tr>
    </tbody>;
  }

  renderFiltersInput() {
    return <tbody className="standard-filters">
      <tr>
        <td>
          Type
        </td>
        <td>
          <label htmlFor="filter-value">Value</label>
        </td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>
          <select onChange={this.updateFilterType.bind(this)} value={this.state.createType}>
            <option key={0} value="">Select a type</option>
            {
              // Allow each of the dimensions to have a filter applied to it
              this.props.dimensions.map((dim, index) =>
                (<option key={index + 1} value={dim.value}>{dim.title}</option>)
              )
            }
          </select>
        </td>
        <td>
          <input
            id="filter-value"
            placeholder="Filter Value"
            value={this.state.createValue}
            onChange={this.updateFilterValue.bind(this)}/>
        </td>
        <td>
          <button className="transaction-filter-add" disabled={this.state.createDisabled}
                  onClick={this.createFilter(this.props.addFilter).bind(this)}>
            Add Filter
          </button>
        </td>
      </tr>
    </tbody>;
  }

  render() {

      // Create the list of individual filters that exist
      let filterList = <ul className="transaction-filter-list">
        {this.props.filters.map((filter, index) => <Filter key={index} index={index} {...filter} />)}
      </ul>;

      var appliedFilters = <ul className="transaction-filter-list">
        {this.props.advancedFilters.map((filterGroup) => {
          let filterItems = filterGroup.filters.map((filterItem,i) => {
            let dimensionIndex = this.props.dimensions.findIndex((dim) => {
              return dim.value === filterItem.dimension
            });
            if (dimensionIndex >= 0) {
              return this.props.dimensions[dimensionIndex].title + " " + (filterItem.condition === "equals" ? "=" : filterItem.condition) + " " + filterItem.value + (filterGroup.filters.length -1 === i ? '' : ' OR ');
            } else {
              return '';
            }
          });
          return (
            <li key={filterGroup.id + uuid} className="transaction-filter">{filterItems}</li>
          );
        })
        }</ul>;

      return (
        <div className="field-filter-inputs">
          <table className="transaction-filter-controls">
            <thead>
            <tr>
              <td>Filter Mode</td>
              <td>
                <select onChange={this.changeFilterMode.bind(this)} value={this.props.filterMethod}>
                  <option value="subtractive">Match All</option>
                  <option value="additive">Match Any</option>
                  <option value="advanced">Advanced</option>
                </select>
              </td>
            </tr>
            </thead>
            {
              this.props.filterMethod === 'advanced' ?
                this.renderAdvancedFiltersInput() : this.renderFiltersInput()
            }
          </table>
          { this.props.filterMethod !== 'advanced' && this.props.filters.length > 0 ? filterList : ''
          }

          { this.props.filterMethod === 'advanced' ? appliedFilters : '' }

          { this.state.showAdvancedFilters &&
          <div className="filter-overlay-wrapper">
            <div className="filter-overlay">
              <a className="no-delay filter-overlay-close body-large" onClick={this.closeAdvancedFilters.bind(this)}>
                <i className="fa fa-save"></i></a>
              <h3>Apply Advanced Filters</h3>
              <FilterList/>
            </div>
          </div>
          }
        </div>
      )
  }
}

export default connector(FilterManager);