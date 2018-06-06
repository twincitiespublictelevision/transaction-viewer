import React, { Component } from 'react';
import FilterItem from './FilterItem.jsx';
import { connector } from '../store';

class FilterGroup extends Component {
  constructor(props) {
    super(props);
  }

  removeFilterItem(filterItem) {
    this.props.removeFilterItem(this.props.index,filterItem);
  }

  addFilterItem() {
    this.props.addFilterItem(this.props.index);
  }

  removeFilterGroup() {
    this.props.removeFilterGroup(this.props.index);
  }

  updateFilterValue(filterID,val) {
    this.props.updateFilterValue(this.props.index, filterID, val);
  }
  updateFilterType(filterID,val) {
    this.props.updateFilterType(this.props.index, filterID, val);
  }
  updateFilterCondition(filterID,val) {
    this.props.updateFilterCondition(this.props.index, filterID, val);
  }

  render() {

    return (
      <div className="filter-group">
        {
          this.props.filterItems.map((filteritem,index) => (
            <FilterItem
              key={filteritem.id}
              dimensions={this.props.dimensions}
              filterItem={filteritem}
              removeFilterItem={this.removeFilterItem.bind(this)}
              updateFilterValue={this.updateFilterValue.bind(this)}
              updateFilterType={this.updateFilterType.bind(this)}
              updateFilterCondition={this.updateFilterCondition.bind(this)}
              showCondition={this.props.filterItems.length !== index+1 ? "or" : ""} ></FilterItem>))
        }
        <button className="btn-filter-or" onClick={this.addFilterItem.bind(this)}>OR</button>
      </div>
    )
  }
}

export default connector(FilterGroup);