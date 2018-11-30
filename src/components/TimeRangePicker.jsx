// @flow

import React, { Component } from 'react';
import { connector } from './../store';
import moment from 'moment';

export class TimeRangePicker extends Component<*, *> {
  changeStartTime(evt: SyntheticInputEvent<HTMLInputElement>) {
    this.changeTime(parseInt(evt.target.value), this.props.startDate, this.props.setStartDate);
  }

  changeEndTime(evt: SyntheticInputEvent<HTMLInputElement>) {
    this.changeTime(parseInt(evt.target.value), this.props.endDate, this.props.setEndDate);
  }

  changeTime(minutes: number, base: moment, action: (moment) => void): void {
    const time = moment(base);
    time.hours(Math.floor(minutes / 60));
    time.minutes(minutes % 60);
    action(time);
  }

  render() {
    const start = this.props.startDate;
    const end = this.props.endDate;

    return (
      <div className="timerange-input">
        <div>
          <div className="timerange-display">
            <div className="label">Start: </div>
            <div className="selection">
              <span className="time hours">{start.format('hh')}</span>
              <span className="separater">:</span>
              <span className="time minutes">{start.format('mm')}</span>
              <span className="ampm">{start.format('A')}</span>
            </div>
          </div>
          <input className="timerange-slider" type="range" min="0" max="1435" step="5" value={start.hours() * 60 + start.minutes()} onChange={this.changeStartTime.bind(this)} />
        </div>
        <div>
          <div className="timerange-display">
            <div className="label">End: </div>
            <div className="selection">
              <span className="time hours">{end.format('hh')}</span>
              <span className="separater">:</span>
              <span className="time minutes">{end.format('mm')}</span>
              <span className="ampm">{end.format('A')}</span>
            </div>
          </div>
          <input className="timerange-slider" type="range" min="0" max="1435" step="5" value={end.hours() * 60 + end.minutes()} onChange={this.changeEndTime.bind(this)} />
        </div>
      </div>
    );
  }
}

export default connector(TimeRangePicker);