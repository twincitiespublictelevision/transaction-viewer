import React, { Component } from 'react';
import { connector } from '../store';

class FilterItem extends Component {
  constructor(props) {
    super(props);
  }

  removeFilterItem() {
    this.props.removeFilterItem(this.props.filterItem);
  }

  updateFilterValue(e) {
    this.props.updateFilterValue(this.props.filterItem.id, e.target.value);
  }
  updateFilterType(e) {
    this.props.updateFilterType(this.props.filterItem.id, e.target.value);
  }
  updateFilterCondition(e) {
    this.props.updateFilterCondition(this.props.filterItem.id, e.target.value);
  }

  render() {

    return (
      <div className="filter-item">
        <span className="filter-type">
          <select value={this.props.filterItem.dimension} onChange={this.updateFilterType.bind(this)}>
            <option key={0} value="">Select a type</option>
            {
              // Allow each of the dimensions to have a filter applied to it
              this.props.dimensions.map((dim, index) =>
                (<option key={index + 1} value={dim.value}>{dim.title}</option>)
              )
            }
           </select>
        </span>
        <span className="filter-condition">
          <select value={this.props.filterItem.condition} onChange={this.updateFilterCondition.bind(this)}>
            <option value="equals">equals</option>
            <option value="not equal to">not equal to</option>
          </select>
        </span>
        <span className="filter-value">
          <input
            id="filter-value"
            placeholder="Filter Value"
            value={this.props.filterItem.value}
            onChange={this.updateFilterValue.bind(this)} />
        </span>
        <span className="filter-remove">
          <i className="fa fa-close fa-large" onClick={this.removeFilterItem.bind(this)}></i>
        </span>
        {
        <span className="filter-group-condition">{this.props.showCondition}</span>
        }

      </div>
    )
  }
}

export default connector(FilterItem);