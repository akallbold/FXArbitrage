import React, { Component } from 'react';
import CurrencyRates from './CurrencyRates'
import Inputs from './Inputs'
import TradeTable from './TradeTable'
import {connect} from "react-redux"
import {fetchRates, createTradePermutations, changeCurrentMoney, exchange, updateCurrency, increaseTradeCount} from "./actions"
let mykey = config.API_KEY;

class MainContainer extends Component {

  componentDidMount = () => {
    console.log("componentdidmount")
    this.props.fetchRates(this.props.allCurrencies, this.props.rates);
    this.props.createTradePermutations();
    console.log("tradeon maincontainerdidmount",this.props.tradeOn)
    // debugger

  }


  // if (this.props.tradeOn){
  //   console.log("trade on!")
  //   this.handleRun()
  // }

  // componentWillReceiveProps = () => {
  //   this.handleRun()
  // }
    // this.handleRun()


  handleRun = () => {
    if (this.props.tradeOn){
      console.log("clicked")
      let trades= [["EUR", "GBP"]]
      trades.forEach(currencyPair => {
        this.tradeMagic(currencyPair)
      })
    }

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
    // console.log("trade perms", this.props.tradePermutations)
    // console.log("trade rates", this.props.AUD)
    return (
      <div className="main-container">
        <CurrencyRates/>
        <Inputs tradeMagic = {this.tradeMagic}/>
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
    tradeOn: state.tradeOn,
    tradePermutations: state.tradePermutations,
    USD: state.USD,
    EUR: state.EUR,
    GBP: state.GBP,
    JPY: state.JPY,
    AUD: state.AUD
  }
}

export default connect(mapStateToProps, {fetchRates, createTradePermutations, changeCurrentMoney, exchange, updateCurrency, increaseTradeCount}) (MainContainer);
