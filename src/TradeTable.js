import React, { Component } from 'react';

class TradeTable extends Component {

formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

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
    let bestTrade = 0
    let bestTradeLocation = 0
    this.props.successfulTrades.map((trade, i) => {
      if (trade.profits > bestTrade) {
        bestTrade = trade.profits
        bestTradeLocation = i
      }
    })
    return this.props.successfulTrades.map((trade, i) => {
      let originalInvestmentFormatted = this.formatNumber(trade.originalInvestment)

      return (
        <tbody key= {i} >
          <tr align="center" className= {i === bestTradeLocation ? "red-border" : ""}>
            {/* <td></td> */}
            <td>{trade.time.toLocaleDateString()}</td>
            <td>{trade.time.toLocaleTimeString()}</td>
            <td>{`${trade.baseCurrencySymbol} ${originalInvestmentFormatted}`}</td>
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
    <table className="col s12 table striped ">
      {/* <caption>Trades</caption> */}
      <thead>
        <tr align="center">
          {/* <th>Best Trade</th> */}
          <th>Date</th>
          <th>Time</th>
          <th>Original Investment</th>
          <th>Trade One</th>
          <th>Trade Two</th>
          <th>Trade Three</th>
          <th>Trade Four</th>
          <th>Profit</th>
        </tr>
      </thead>
      {this.createTradeElements()}
    </table>
  )}
}


export default (TradeTable);
