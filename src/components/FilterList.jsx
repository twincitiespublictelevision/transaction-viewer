import React, { Component } from 'react';
import FilterGroup from './FilterGroup.jsx';
import { connector } from '../store';

let uuid = require('uuid/v4');

class FilterList extends Component {
  state: {
    filterGroups: Array
  };

  constructor(props) {
    super(props);

    this.addFilterGroup = this.addFilterGroup.bind(this);
    this.removeFilterGroup = this.removeFilterGroup.bind(this);
    this.addFilterItem = this.addFilterItem.bind(this);
    this.removeFilterItem = this.removeFilterItem.bind(this);
    this.updateFilterItemType = this.updateFilterItemType.bind(this);
    this.updateFilterItemCondition = this.updateFilterItemCondition.bind(this);
    this.updateFilterItemValue = this.updateFilterItemValue.bind(this);
  }

  addFilterGroup() {
    let filterGroups = this.props.advancedFilters.concat({ id: uuid(), filters: [{id: 0, dimension: '', condition: 'equals', value: ''}]});
    this.props.setAdvancedFilters(filterGroups);
  }

  removeFilterGroup(groupID) {
    let groups = this.props.advancedFilters.filter(group => group.id !== groupID);
    this.props.setAdvancedFilters(groups);
  }

  addFilterItem(groupID) {
    let groups = this.props.advancedFilters.slice().map(group => {
      if(group.id === groupID)
      {
        let newGroup = Object.assign({},group);
        newGroup.filters = group.filters.concat({id: uuid(), dimension: '', condition: 'equals', value: ''});
        return newGroup;
      } else {
        return group;
      }
    })

    this.props.setAdvancedFilters(groups);
  }

  updateFilterItemValue(groupID, filterID, val) {
    let groups = this.props.advancedFilters.slice().map(group => {
      if(group.id === groupID)
      {
        let newGroup = Object.assign({},group);
        newGroup.filters = group.filters.slice().map(filterItem => {
          if (filterItem.id === filterID) {
            let newFilterItem = Object.assign({},filterItem);
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
    })

    this.props.setAdvancedFilters(groups);
  }

  updateFilterItemCondition(groupID, filterID, val) {
    let groups = this.props.advancedFilters.slice().map(group => {
      if(group.id === groupID)
      {
        let newGroup = Object.assign({},group);
        newGroup.filters = group.filters.slice().map(filterItem => {
          if (filterItem.id === filterID) {
            let newFilterItem = Object.assign({},filterItem);
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
    })

    this.props.setAdvancedFilters(groups);

  }

  updateFilterItemType(groupID, filterID, val) {
    let groups = this.props.advancedFilters.slice().map(group => {
      if(group.id === groupID)
      {
        let newGroup = Object.assign({},group);
        newGroup.filters = group.filters.slice().map(filterItem => {
          if (filterItem.id === filterID) {
            let newFilterItem = Object.assign({},filterItem);
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
    })

    this.props.setAdvancedFilters(groups);

  }

  removeFilterItem(groupID, filterItem) {
    let groups = this.props.advancedFilters.slice().map(group => {
      if(group.id === groupID)
      {
        let newGroup = Object.assign({},group);
        newGroup.filters = group.filters.slice();
        let filterIndex = newGroup.filters.indexOf(filterItem);
        newGroup.filters.splice(filterIndex, 1);
        return newGroup;
      } else {
        return group;
      }
    })

    //remove groups that have no filters left
    groups = groups.filter(group => group.filters.length >= 1);

    this.props.setAdvancedFilters(groups);

  }

  render() {
    return (
      <div className="filter-controls">
        {
          this.props.advancedFilters.map((filterGroup) =>
            (
              <div key={filterGroup.id} >
              <FilterGroup
                index={filterGroup.id}
                filterItems={filterGroup.filters}
                removeFilterGroup={this.removeFilterGroup}
                updateFilterType={this.updateFilterItemType}
                updateFilterCondition={this.updateFilterItemCondition}
                updateFilterValue={this.updateFilterItemValue}
                addFilterItem={this.addFilterItem}
                removeFilterItem={this.removeFilterItem}>
              </FilterGroup>
              <div className="group-separate"><h3><span>AND</span></h3></div>
              </div>
            )
          )
        }
        <button onClick={this.addFilterGroup}>Add Filter Group</button>
      </div>
    )
  }
}

export default connector(FilterList);