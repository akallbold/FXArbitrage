import React, { Component } from 'react';

class TradeTable extends Component {

createTradeElements = () => {
  if (this.props.successfulTrades.length === 0) {
    let output = []
    let table = []
    for (let i = 0; i < 20; i++) {
      let children = []
      for (let j = 0; j < 8; j++) {
        children.push(<td key= {j}></td>)
      }
      table.push(<tr key = {i}>{children}</tr>)
    }
    output.push(<tbody key = "">{table}</tbody>)
    return output
  } else {
    return this.props.successfulTrades.map((trade, i) => {
      return (
        <tbody key= {i}>
          <tr align="center">
            <td>{trade.time.toLocaleDateString()}</td>
            <td>{trade.time.toLocaleTimeString()}</td>
            <td>{`${trade.baseCurrencySymbol} ${trade.originalInvestment}`}</td>
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
}

  render() {
    return (
    <table className="trade-table">
      <caption>Trades</caption>
      <tbody>
        <tr align="center">
          <th>Date</th>
          <th>Time</th>
          <th>Original Investment</th>
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
