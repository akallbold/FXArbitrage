import React, { Component } from 'react';
import CurrencyRates from './CurrencyRates'
import Inputs from './Inputs'
import TradeTable from './TradeTable'
import {connect} from "react-redux"
import {fetchRates} from "./actions"

class MainContainer extends Component {

  componentDidMount = () => {
    console.log("rates array in maincontainer", this.props.rates)
    this.props.fetchRates(this.props.allCurrencies, this.props.rates)
    // debugger
    this.tradeMagic()
  }



  tradeMagic = () => {
    console.log("rates in main", this.props.rates)
    // debugger
    // if (this.props.numberOfTrades === 0) {
    //   //trade from base
    //   this.props.numberOfTrades++
    //   this.props.currentMoney = this.props.maxInvestment
    //   this.props.currentMoney *= this.props.rates[currentCurrency][futureCurrency]
    //   this.props.currentCurrency =
    // }else if (this.props.numberOfTrades === 2) {
    //   //trade into base
    // } else {
    //   //middle trade from or into don't matter
    // }
  }

//     function firstNode(baseCurrency, outCurrency) {
//       getRates(baseCurrency).then(exchangeRates => {
//         debugger;
//         outCurrencyRate = findCurrency(exchangeRates, outCurrency);
//       });
//       baseCurrency = outCurrency;
//       currentMoney = startMoney * outCurrencyRate;
//     }
//  futureCurrencyRate = () => {}

//   function findCurrency(data, outCurrency) {
//     for (var currency in data.rates) {
//       if (currency == outCurrency) {
//         let result = exchangeRates.rates[currency];
//       }
//     console.log(result);
//   }
// }


  render() {
    return (
      <div className="App">
        <CurrencyRates/>
        <Inputs/>
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
    futureCurrency: state.futureCurrency,
    maxInvestment: state.maxInvestment,
    numberOfTrades: state.numberOfTrades,
    rates: state.rates
  }
}

export default connect(mapStateToProps, {fetchRates}) (MainContainer);
