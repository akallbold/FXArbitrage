import React, { Component } from 'react';
// import {connect} from "react-redux"
// import {fetchRates, createTradePermutations, changeCurrentMoney, exchange, updateCurrency, increaseTradeCount} from "./actions"


class TradeTable extends Component {

createTradeElements = () => {
  // console.log("props", this.props.successfulTrades)
  // debugger
  return (
    <tbody>
      <tr align="center">
        <td>Apr 16</td>
        <td>9:00:30AM</td>
        <td>GBP</td>
        <td>EUR</td>
        <td>$1,250</td>
        <td>$100,001,250</td>
      </tr>
    </tbody>
  )
}


  render() {
    // debugger
    return (
    <table className="trade-table">
      <caption>Trades</caption>
      <tbody>
        <tr align="center">
          <th>Date</th>
          <th>Time</th>
          <th>Trade One</th>
          <th>Trade Two</th>
          <th>Profit</th>
          <th>Total</th>
        </tr>
      </tbody>
      {this.createTradeElements()}
      <tbody>
        <tr align="center">
          <td>Apr 16</td>
          <td>10:00:30AM</td>
          <td>GBP</td>
          <td>AUD</td>
          <td>$1,000</td>
          <td>$100,002,250</td>
        </tr>
      </tbody>
      <tbody>
        <tr align="center">
          <td>Apr 16</td>
          <td>11:00:30AM</td>
          <td>GBP</td>
          <td>JPY</td>
          <td>$500</td>
          <td>$100,002,750</td>
        </tr>
      </tbody>
      <tbody>
        <tr align="center">
          <td>Apr 16</td>
          <td>11:00:30AM</td>
          <td>GBP</td>
          <td>JPY</td>
          <td>$500</td>
          <td>$100,002,750</td>
        </tr>
      </tbody>
      <tbody>
        <tr align="center">
          <td>Apr 16</td>
          <td>11:00:30AM</td>
          <td>AUD</td>
          <td>JPY</td>
          <td>$2,500</td>
          <td>$100,005,250</td>
        </tr>
      </tbody>
    </table>
  )}
}


export default (TradeTable);
