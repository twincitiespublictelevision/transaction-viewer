// @flow

import React, { Component } from 'react';
import { connector } from './../store';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import type { Moment } from 'moment';

export class DateManager extends Component<*, *> {
  state: {
    focusedInput: null
  };

  constructor(props: any) {
    super(props);
    this.state = {
      focusedInput: null
    };
  }

  performUpdate(from: Moment, change: Moment, action: (a: Moment) => void): void {

    // Pull the time from the current date times and update the new date
    // with it before pushing the change to the store
    change.hours(from.hours());
    change.minutes(from.minutes());
    change.seconds(from.seconds());

    action(change);
  }

  importTime(from: Moment, base: Moment) {
    let m = moment(base);

    // Pull the time from the current date times and update the new date
    // with them
    m.hours(from.hours());
    m.minutes(from.minutes());
    m.seconds(from.seconds());

    return m;
  }

  setDate({startDate, endDate}: {startDate: Moment, endDate: Moment}) {

    // If a start or end date are not sent, then use the currently known
    // value instead
    startDate = startDate instanceof moment ? startDate : this.props.startDate;
    endDate = endDate instanceof moment ? endDate : this.props.endDate;

    // If the start date and end date are ever the same day, then reset
    // the start and end times so that they cover the full day
    if (startDate.year() === endDate.year() &&
        startDate.month() === endDate.month() &&
        startDate.date() === endDate.date()) {

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

  render() {
    return (
      <DateRangePicker
        startDateId="start-date"
        endDateId="end-date"
        startDate={this.props.startDate} // momentPropTypes.momentObj or null,
        endDate={this.props.endDate} // momentPropTypes.momentObj or null,
        onDatesChange={this.setDate.bind(this)} // PropTypes.func.isRequired,
        focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
        onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
        isOutsideRange={() => false}
        minimumNights={0}
      />
    );
  }
}

export default connector(DateManager);