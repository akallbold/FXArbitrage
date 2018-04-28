import React, { Component } from 'react';
import CurrencyRates from './CurrencyRates'
import Inputs from './Inputs'
import TradeTable from './TradeTable'
// import { compact } from 'lodash'
// import {connect} from "react-redux"
// import {fetchRates, createTradePermutations, changeCurrentMoney, exchange, updateCurrency, increaseTradeCount} from "./actions"
import API_KEY from './config.js';

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
    maxInvestment: 1000,
    nonBaseCurrencies:["EUR", "GBP", "JPY", "AUD"],
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
    this.startTrades()
    // debugger
  }

  // componentDidUpdate = () => {
  //
  // }

  getRates = (currencyArray) => {
    currencyArray.forEach(currency => {
      this.fetchRates(currency)
    })
  }

  fetchRates = (currency) => {
    // debugger
    fetch(`http://data.fixer.io/api/latest?access_key=${API_KEY}&base=${currency}&symbols=USD,AUD,EUR,JPY,GBP`)
    .then(response => response.json())
    .then(data => {
      this.setState({[data.base]: data.rates, timeOfLastFetch: new Date()})
    })
  }

  updateMaxInvestment = (input) => {
    this.setState({maxInvestment:input})
  }

  updateTrade = () => {
    this.setState({trade:!this.state.trade})
  }

  startTrades = () => {
    // console.log("in starttrades")
    // if (this.state.trade){
      // console.log("trade is on")
      let successfulTradePermutations = this.state.tradePermutations.reduce((acc, permutation) => {
        const successfulTrade = this.tradeMagic(permutation);
        if (successfulTrade) {
          acc.push(successfulTrade);
        }
        return acc;
      }, []);
      this.setState({
        successfulTrades: [...this.state.successfulTrades, ...successfulTradePermutations]
      });
    // console.log("trade is off")
    // }
  }

  tradeMagic = (currencyPermutation) => {
    let baseCurrency = this.state.baseCurrency
    let currentCurrency = this.state.currentCurrency
    let currentMoney = this.state.maxInvestment

    for (let i=0;i<=currencyPermutation.length;i++){
      if (i === 0) {
        console.log("currentmoney in trade magic", currentMoney, i)
        currentMoney *= this.state[baseCurrency][currencyPermutation[0]]
        currentCurrency = currencyPermutation[0]
      } else if (i !== currencyPermutation.length && i !== 0) {
        console.log("currentmoney in trade magic", currentMoney, i)
        currentMoney *= this.state[currentCurrency][currencyPermutation[1]]
        currentCurrency = currencyPermutation[1]
      } else if(i === currencyPermutation.length){
        console.log("currentmoney in trade magic", currentMoney, i)
        currentMoney *= this.state[currentCurrency][baseCurrency]
      } else {
          console.log("error in trademagic")
      }
    }

    let roundedProfits = parseFloat(Math.round((currentMoney-this.state.maxInvestment) * 100) / 100).toFixed(2);
    if (roundedProfits>0){
      console.log("current money in if statement", currentMoney)
      console.log("maxinvestment", this.state.maxInvestment)
      let newObject = {time:this.state.timeOfLastFetch, currencyPermutation:currencyPermutation, profits:roundedProfits}
      return newObject;
      debugger
    } else{
      console.log("no trade")
    }
  }





  render() {
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
