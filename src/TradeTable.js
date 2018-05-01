import React, { Component } from 'react';
// import {connect} from "react-redux"
// import {fetchRates, createTradePermutations, changeCurrentMoney, exchange, updateCurrency, increaseTradeCount} from "./actions"


class TradeTable extends Component {

createTradeElements = () => {
  if (this.props.successfulTrades.length === 0) {
    for (let i = 0; i<=20;i++){
      return (
        <tbody>
          <tr align="center">
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr align="center">
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr align="center">
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr align="center">
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr align="center">
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr align="center">
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr align="center">
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr align="center">
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr align="center">
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr align="center">
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr align="center">
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr align="center">
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr align="center">
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr align="center">
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
        </tbody>
      )
    }

  } else
  return this.props.successfulTrades.map((trade, i) => {
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
        </tr>
      </tbody>
    )
  })
}

  render() {
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
        </tr>
      </tbody>
      {this.createTradeElements()}
    </table>
  )}
}


export default (TradeTable);
