import React, { Component } from 'react';
// import {connect} from "react-redux"
// import {fetchRates, createTradePermutations, changeCurrentMoney, exchange, updateCurrency, increaseTradeCount} from "./actions"


class TradeTable extends Component {

createTradeElements = () => {
  // console.log("props", this.props.successfulTrades)
  return this.props.successfulTrades.map((trade, i) => {
    // totalProfits += trade.roundedProfits
    return (
      <tbody key= {i}>
        <tr align="center">
          <td>{trade.time.toLocaleDateString()}</td>
          <td>{trade.time.toLocaleTimeString()}</td>
          <td>{trade.currencyPermutation[0]}</td>
          <td>{trade.currencyPermutation[1]}</td>
          <td>{trade.currencyPermutation[2] ? trade.currencyPermutation[2] : "None" }</td>
          <td>{trade.currencyPermutation[3] ? trade.currencyPermutation[3] : "None" }</td>
          <td>${trade.profits}</td>
          {/* <td>$100,001,250</td> */}
        </tr>
      </tbody>
    )
  })
}


  render() {
    // console.log(this.props.successfulTrades)
    return (
    <table className="trade-table">
      <caption>Trades</caption>
      <tbody>
        <tr align="center">
          <th>Date</th>
          <th>Time</th>
          <th>Trade One</th>
          <th>Trade Two</th>
          <th>Trade Three</th>
          <th>Trade Four</th>
          <th>Profit</th>
          {/* <th>Total</th> */}
        </tr>
      </tbody>
      {this.createTradeElements()}
      {/* <tbody>
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
          <td>JPY</td> */}
          {/* <td>$500</td>
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
      </tbody> */}
    </table>
  )}
}


export default (TradeTable);
