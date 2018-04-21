import React, { Component } from 'react';
import CurrencyRates from './CurrencyRates'
import Inputs from './Inputs'
import TradeTable from './TradeTable'
import { compact } from 'lodash'
// import {connect} from "react-redux"
// import {fetchRates, createTradePermutations, changeCurrentMoney, exchange, updateCurrency, increaseTradeCount} from "./actions"
// import config from './config.js'
// let mykey = config.API_KEY;

// Anna, I put this here because now it is reachable by tests
export const createTradePermutations = (nonBaseCurrencies) => {
  let tradeArray = []
  // TODO: avoid for loops, use map, filter, reduce instead
  for (let i=0;i<nonBaseCurrencies.length;i++){
    let currentArray = []
    for (let j=0;j<nonBaseCurrencies.length;j++){
      currentArray.push(nonBaseCurrencies[i])
      if (!currentArray.includes(nonBaseCurrencies[j])){
        currentArray.push(nonBaseCurrencies[j])
        let uniqueItems = Array.from(new Set(currentArray))
        tradeArray.push(uniqueItems)
        currentArray=[]
      }
    }
  }
  return tradeArray
}

class MainContainer extends Component {

  state= {
    allCurrencies:["USD", "EUR", "GBP", "JPY", "AUD"],
    baseCurrency: "USD",
    currentCurrency: "USD",
    currentExchange:1,
    currentMoney: 0,
    maxInvestment: 100000000,
    nonBaseCurrencies:["EUR", "GBP", "JPY", "AUD"],
    numberOfTrades:0,
    successfulTrades:[],
    timeOfLastFetch: "",
    trade: false,
    tradePermutations:[],
    USD:{},
    EUR:{},
    GBP:{},
    JPY:{},
    AUD:{}
  }

  componentDidMount = () => {
    this.getRates(this.state.allCurrencies);
    this.setState({tradePermutations: createTradePermutations(this.state.nonBaseCurrencies)})
  }

  getRates = (currencyArray) => {
    currencyArray.forEach(currency => {
      this.fetchRates(currency)
    })
  }

  fetchRates = (currency) => {
    fetch(`http://data.fixer.io/api/latest?access_key=163d5e4c148ba5fa464c57d6873e9e95&base=${currency}&symbols=USD,AUD,EUR,JPY,GBP`)
    .then(response => response.json())
    .then(data => {
      this.setState({[data.base]: data.rates, timeOfLastFetch: new Date()})
      // this.setState({timeOfLastFetch: Time.now})
    })
  }

  updateMaxInvestment = (input) => {
    this.setState({maxInvestment:input})
  }

  updateTrade = () => {
    this.setState({trade:!this.state.trade})
  }

  startTrades = () => {
    // if (this.state.trade){
      this.state.tradePermutations.forEach(currencyPair => {
        this.tradeMagic(currencyPair)
      })
    // }
  }

  tradeMagic = (currencyPair) => {
    let baseCurrency = this.state.baseCurrency
    let currentCurrency = this.state.currentCurrency
    let currentMoney = this.state.maxInvestment
    let tradeNumber = this.state.numberOfTrades
    for (let i=0;i<3;i++){
      if (tradeNumber === 0) {
        currentMoney *= this.state[baseCurrency][currencyPair[0]]
        currentCurrency = currencyPair[0]
      } else if (tradeNumber === 1) {
        // debugger
        currentMoney *= this.state[currentCurrency][currencyPair[1]]
        currentCurrency = currencyPair[1]
      } else if(tradeNumber === 2){
        currentMoney *= this.state[currentCurrency][baseCurrency]
      } else {
          console.log("error in trademagic")
      }
      tradeNumber++
    }

    if (currentMoney > this.state.maxInvestment){
      console.log(`YOU EARNED $${currentMoney - this.state.maxInvestment}`)
      let newArray = this.state.successfulTrades.push({time:this.state.timeOfLastFetch, currencyPair:currencyPair, profits:currentMoney - this.state.maxInvestment})
      this.setState({successfulTrades:newArray}, console.log(this.state.successfulTrades))
      this.setState({maxInvestment:currentMoney})
    } else if (currentMoney === this.state.maxInvestment){
      console.log("You did not earn any money off this trade", currencyPair)
    } else {
      console.log("Something went wrong")
    }
    // debugger
  }





  render() {
    console.log("trade",this.state.trade)
    return (
      <div className="main-container">
        <CurrencyRates USD= {this.state.USD}
                       EUR= {this.state.EUR}
                       GBP= {this.state.GBP}
                       AUD= {this.state.AUD}
                       JPY= {this.state.JPY}
        />
        <Inputs startTrades = {this.startTrades}
                maxInvestment = {this.state.maxInvestment}
                updateMaxInvestment = {this.updateMaxInvestment}
                trade = {this.state.trade}
                updateTrade = {this.updateTrade}/>
        <TradeTable successfulTrades= {this.state.successfulTrades}/>
      </div>
    );
  }
}

export default (MainContainer);
