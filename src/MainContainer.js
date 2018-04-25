import React, { Component } from 'react';
import CurrencyRates from './CurrencyRates'
import Inputs from './Inputs'
import TradeTable from './TradeTable'
// import { get } from 'lodash'
// import {connect} from "react-redux"
// import {fetchRates, createTradePermutations, changeCurrentMoney, exchange, updateCurrency, increaseTradeCount} from "./actions"
// import config from './config.js'
// let mykey = config.API_KEY;

class MainContainer extends Component {

  state= {
    allCurrencies:["USD", "EUR", "GBP", "JPY", "AUD"],
    baseCurrency: "USD",
    currentCurrency: "USD",
    currentExchange:1,
    currentMoney: 0,
    maxInvestment: 100000000,
    nonBaseCurrencies:["EUR", "GBP", "JPY", "AUD"],
    // numberOfTrades:0,
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
    this.createTradePermutations();
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

  createTradePermutations = () => {
    let tradeArray = []
    for (let i=0;i<this.state.nonBaseCurrencies.length;i++){
      let currentArray = []
      for (let j=0;j<this.state.nonBaseCurrencies.length;j++){
        currentArray.push(this.state.nonBaseCurrencies[i])
        if (!currentArray.includes(this.state.nonBaseCurrencies[j])){
          currentArray.push(this.state.nonBaseCurrencies[j])
          let uniqueItems = Array.from(new Set(currentArray))
          tradeArray.push(uniqueItems)
          currentArray=[]
        }
      }
    }
    this.setState({tradePermutations: tradeArray})
  }

  updateMaxInvestment = (input) => {
    this.setState({maxInvestment:input})
  }

  updateTrade = () => {
    this.setState({trade:!this.state.trade})
  }

  startTrades = () => {
    // console.log(this.state.tradePermutations)
    // if (this.state.trade){
      this.state.tradePermutations.forEach(currencyPermutation => {
        this.tradeMagic(currencyPermutation)
      })
    // }
  }

  tradeMagic = (currencyPermutation) => {
    let baseCurrency = this.state.baseCurrency
    let currentCurrency = this.state.currentCurrency
    let currentMoney = this.state.maxInvestment
    // let tradeNumber = this.state.numberOfTrades
    for (let i=0;i<currencyPermutation.length;i++){
      if (i === 0) {
        currentMoney *= this.state[baseCurrency][currencyPermutation[0]]
        currentCurrency = currencyPermutation[0]
      } else if (i !== currencyPermutation.length && i !== 0) {
        // debugger
        currentMoney *= this.state[currentCurrency][currencyPermutation[1]]
        currentCurrency = currencyPermutation[1]
      } else if(i === currencyPermutation.length){
        currentMoney *= this.state[currentCurrency][baseCurrency]
      } else {
          console.log("error in trademagic")
      }
      // tradeNumber++
    }

    if (currentMoney > this.state.maxInvestment){
      // debugger
      let newObject = {time:this.state.timeOfLastFetch, currencyPermutation:currencyPermutation, profits:currentMoney - this.state.maxInvestment}
      this.setState({successfulTrades:[...this.state.successfulTrades,newObject]})
    } else if (currentMoney === this.state.maxInvestment){
      // console.log("You did not earn any money off this trade", currencyPermutation)
    } else {
      // console.log("You lost money- don't do this trade")
    }
  }





  render() {
    console.log("trade",this.state.currentMoney)
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
