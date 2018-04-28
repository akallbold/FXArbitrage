import React, { Component } from 'react';
import CurrencyRates from './CurrencyRates'
import Inputs from './Inputs'
import TradeTable from './TradeTable'
// import { compact } from 'lodash'
// import {connect} from "react-redux"
// import {fetchRates, createTradePermutations, changeCurrentMoney, exchange, updateCurrency, increaseTradeCount} from "./actions"
// import config from './config.js'
// let mykey = config.API_KEY;

// Anna, I put this here because now it is reachable by tests
export const createTradePermutations = (nonBaseCurrencies) => {
  let tradeArray = []
  // TODO: avoid for loops, use map, filter, reduce instead
  // AKB COMMMENTS: this function will need an overhaul. Its actually a great algorithm question. How to create all permutations of an array with four elements (nonBaseCurrencies). The final list should include arrays of lengths 2 to 4 long and order does matter but there should be no duplicates in the same array. EX: [A,B], [B,A],[B,C,D],[A,B,C,D] are all valid, [A,A,A] is not. For now, I am trying to get the rest of the site working so I am only building permutations of 2 currencies but eventually it should consider all four.
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
    fetch(`http://data.fixer.io/api/latest?access_key=163d5e4c148ba5fa464c57d6873e9e95&base=${currency}&symbols=USD,AUD,EUR,JPY,GBP`)
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
