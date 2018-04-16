import React, { Component } from 'react';
import {connect} from "react-redux"
import {fetchRates, createTradePermutations, changeCurrentMoney, exchange, updateCurrency, increaseTradeCount} from "./actions"


class TradeTable extends Component {
  componentDidMount = () => {
    // this.props.fetchRates(this.props.allCurrencies, this.props.rates)
    // this.props.createTradePermutations()
    // this.handleRun()
  }

  componentWillReceiveProps = () => {
    this.handleRun()
  }

  handleRun = () => {
    // this.props.createTradePermutations()
    // this.props.fetchRates(this.props.allCurrencies, this.props.rates)
    // this.props.createTradePermutations()
    console.log("trade array in handlerun", this.props.tradePermutations)
    let trades= [["EUR", "GBP"]]
    trades.forEach(currencyPair => {
      this.tradeMagic(currencyPair)
    })
  }

  tradeMagic = (currencyPair) => {
    let baseCurrency = this.props.baseCurrency
    let currentCurrency = this.props.currentCurrency
    let currentMoney = this.props.maxInvestment
    let tradeNumber = this.props.numberOfTrades
    for (let i=0;i<3;i++){
      if (tradeNumber === 0) {
        currentMoney *= this.props[this.props.baseCurrency][currencyPair[0]]
        // this.props.exchange([this.props.baseCurrency,currencyPair[0]])
        currentCurrency = currencyPair[0]
        // debugger
        // this.props.updateCurrency(currencyPair[1])
        tradeNumber++
      } else if (tradeNumber === 1) {
          this.props.exchange([this.props.currentCurrency,currencyPair[0]])
          this.props.updateCurrency(currencyPair[1])
                  tradeNumber++
      } else if(tradeNumber === 2){
          this.props.exchange([this.props.currentCurrency,this.props.baseCurrency])
          this.props.updateCurrency(this.props.baseCurrency)
                  tradeNumber++
      } else {
          console.log("error in trademagic")
      }
      // this.props.increaseTradeCount()
    }
    if (this.props.currentMoney > this.props.maxInvestment){
      //save this in a state object to add to a table
      console.log(`YOU EARNED $${this.props.currentMoney - this.props.maxInvestment}`)
    } else if (this.props.currentMoney === this.props.maxInvestment){
      console.log("You did not earn any money off this trade", currencyPair)
    } else {
      // debugger
      console.log("Something went wrong")
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
          <th>Trade One</th>
          <th>Trade Two</th>
          <th>Profit</th>
          <th>Total</th>
        </tr>
      </tbody>
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
  )
  }
}


const mapStateToProps = (state) => {
  return {
    allCurrencies: state.allCurrencies,
    baseCurrency: state.baseCurrency,
    currentCurrency: state.currentCurrency,
    currentExchange: state.currentExchange,
    currentMoney: state.currentMoney,
    maxInvestment: state.maxInvestment,
    numberOfTrades: state.numberOfTrades,
    tradePermutations: state.tradePermutations,
    USD: state.USD,
    EUR: state.EUR,
    GBP: state.GBP,
    JPY: state.JPY,
    AUD: state.AUD
  }
}

export default connect(mapStateToProps, {fetchRates, createTradePermutations, changeCurrentMoney, exchange, updateCurrency, increaseTradeCount}) (TradeTable);

// export default TradeTable;
