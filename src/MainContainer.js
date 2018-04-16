import React, { Component } from 'react';
import CurrencyRates from './CurrencyRates'
import Inputs from './Inputs'
import TradeTable from './TradeTable'
import {connect} from "react-redux"
import {fetchRates, createTradePermutations, changeCurrentMoney, exchange, updateCurrency, increaseTradeCount} from "./actions"

class MainContainer extends Component {

  componentDidMount = () => {
    this.props.fetchRates(this.props.allCurrencies, this.props.rates)
    this.props.createTradePermutations()
    // this.handleRun()
  }

  // componentWillReceiveProps = () => {
  //   this.handleRun()
  // }
    // this.handleRun()








  render() {
    return (
      <div className="main-container">
        <CurrencyRates/>
        <Inputs handleRun={this.handleRun}/>
        <TradeTable/>
      </div>
    );
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

export default connect(mapStateToProps, {fetchRates, createTradePermutations, changeCurrentMoney, exchange, updateCurrency, increaseTradeCount}) (MainContainer);
