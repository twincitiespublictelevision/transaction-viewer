// @flow

import React, {Component} from 'react';
import {connector} from '../store';
import type {Record} from '../store';
import type {Action} from '../actions/actions';

/**
 * Represents fields from props that will be used to display summarized transaction data.
 */
type DataRow = {
  summary: string,
  numPlg: number,
  total: number,
  annualTotal: number,
  numCharges: number,
  numEFT: number,
  numPaypal: number,
}

/**
 * Provides a map of types from DataRow to display-friendly strings
 * @type {{summary: string, numPlg: string, total: string, annualTotal: string, numCharges: string, numEFT: string, numPaypal: string}}
 */
const headerDisplayMap = {
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
function formatMoney(value: number): string {

  return '$' + value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

/**
 * If the key string matches any key from headerDisplayMap whose value needs extra formatting for display,
 * return the formatted value. Works for money fields so far.
 * @param key
 * @param value
 * @returns {*}
 */
function formatForDisplay(key: string, value: any): string {

  return (['total', 'annualTotal'].indexOf(key) < 0) ? value : formatMoney(value);
}

/**
 * General purpose method to execute an arbitrary function on the fields of a DataRow.
 * @param object
 * @param callback
 * @returns {Array}
 */
function mapObject(object: DataRow, callback: (string, any) => any): Array<any> {
  return Object.keys(object).map(function (key) {
    return callback(key, object[key]);
  });
}

/**
 * This component draws a table of summarized transaction data.
 */
export class TransactionTotals extends Component<*, *> {

  /**
   * Build a DataRow that summarizes one-time donations.
   * @param rows
   * @returns {{summary: string, numPlg: *, total: number, annualTotal: *, numCharges: *, numEFT: *, numPaypal: *}}
   */
  computeOnetimeData(rows: Array<Record>): DataRow {

    let onetime = rows.filter(function (row) {
      return (row.approved === 'Yes') && (row.one_time !== null) && (row.one_time > 0);
    });

    let oneTimeTotal = onetime.reduce(function (a, b) {
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
        return ((b.one_time != null) && (b.payment_method === 'Credit')) ? a + 1 : a;
      }, 0),
      numEFT: onetime.reduce(function (a, b) {
        return ((b.one_time != null) && (b.payment_method === 'EFT')) ? a + 1 : a;
      }, 0),
      numPaypal: onetime.reduce(function (a, b) {
        return ((b.one_time != null) && (b.payment_method === 'Paypal')) ? a + 1 : a;
      }, 0),
    };
  }

  /**
   * Build a DataRow that summarizes monthly donations.
   * @param rows
   * @returns {{summary: string, numPlg: *, total: *, annualTotal: number, numCharges: *, numEFT: *, numPaypal: *}}
   */
  computeMonthlyData(rows: Array<Record>): DataRow {

    let monthly = rows.filter(function (row) {
      return (row.approved === 'Yes') && (row.monthly != null) && (row.monthly > 0);
    });

    let monthlyTotal = monthly.reduce(function (a, b) {
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
        return ((b.monthly != null) && (b.payment_method === 'Credit')) ? a + 1 : a;
      }, 0),
      numEFT: monthly.reduce(function (a, b) {
        return ((b.monthly != null) && (b.payment_method === 'EFT')) ? a + 1 : a;
      }, 0),
      numPaypal: monthly.reduce(function (a, b) {
        return ((b.monthly != null) && (b.payment_method === 'Paypal')) ? a + 1 : a;
      }, 0),
    };
  }

  /**
   * Sums one-time and monthly donation data
   * @param oneTimeRow
   * @param monthlyRow
   * @returns {{summary: string, numPlg: number, total: number, annualTotal: number, numCharges: number, numEFT: number, numPaypal: number}}
   */
  computeTotalData(oneTimeRow: DataRow, monthlyRow: DataRow): DataRow {

    return {
      summary: "Total",
      numPlg: oneTimeRow.numPlg + monthlyRow.numPlg,
      total: oneTimeRow.total + monthlyRow.total,
      annualTotal: oneTimeRow.annualTotal + monthlyRow.annualTotal,
      numCharges: oneTimeRow.numCharges + monthlyRow.numCharges,
      numEFT: oneTimeRow.numEFT + monthlyRow.numEFT,
      numPaypal: oneTimeRow.numPaypal + monthlyRow.numPaypal,
    }
  }

  render() {

    let oneTimeData = this.computeOnetimeData(this.props.rows);
    let monthlyData = this.computeMonthlyData(this.props.rows);

    return (
      <table className="summary-table">
        <thead>
        <tr>
          {Object.keys(headerDisplayMap).map(function (key: string) {
            return <th key={key}>{headerDisplayMap[key]}</th>;
          })}
        </tr>
        </thead>
        <tbody>
        <tr>
          {
            mapObject(oneTimeData, function (key: string, value) {
              return <td key={key}>{formatForDisplay(key, value)}</td>;
            })
          }
        </tr>
        <tr>
          {
            mapObject(monthlyData, function (key: string, value) {
              return <td key={key}>{formatForDisplay(key, value)}</td>;
            })
          }
        </tr>
        <tr>
          {
            mapObject(this.computeTotalData(oneTimeData, monthlyData), function (key: string, value) {
              return <td key={key}>{formatForDisplay(key, value)}</td>;
            })
          }
        </tr>
        </tbody>
      </table>
    );
  }
}

export default connector(TransactionTotals);