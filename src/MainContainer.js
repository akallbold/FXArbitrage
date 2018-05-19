import React, { Component } from 'react';
import CurrencyRates from './CurrencyRates'
import Inputs from './Inputs'
import TradeTable from './TradeTable'
import API_KEY from './config.js';

// Anna, I put this here because now it is reachable by tests
export const createTradePermutations = (nonBaseCurrencies) => {
  let fourArrays = permute(nonBaseCurrencies)
  let threeArrays = fourArrays.map(array => {
    return array.slice(0,3)
  })
  let twoArrays = threeArrays.map(array => {
    return array.slice(0,2)
  })
  let allArrays = [...fourArrays, ...threeArrays, ...twoArrays]
  return allArrays
}

function permute(permutation) {
  var length = permutation.length,
      result = [permutation.slice()],
      c = new Array(length).fill(0),
      i = 1, k, p;

  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      result.push(permutation.slice());
    } else {
      c[i] = 0;
      ++i;
    }
  }
  return result;
}

class MainContainer extends Component {

  state= {
    allCurrencies:["USD", "EUR", "GBP", "JPY", "AUD"],
    baseCurrency: "USD",
    baseCurrencySymbol:"$",
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
    setInterval(this.getRates(this.state.allCurrencies), 60000);
    this.setState({tradePermutations: createTradePermutations(this.state.nonBaseCurrencies)})
  }

  componentWillReceiveProps = () => {
    this.startTrades()
  }

  getRates = (currencyArray) => {
    currencyArray.forEach(currency => {
      console.log("in getrates")
      this.fetchRates(currency)
    })
  }

  clearPreviousTrades = () => {
    this.setState({successfulTrades: []})
  }

  fetchRates = (currency) => {
    console.log("in fetchrates")
    fetch(`https://data.fixer.io/api/latest?access_key=${API_KEY}&base=${currency}&symbols=USD,AUD,EUR,JPY,GBP`)
    .then(response => response.json())
    .then(data => {
      this.setState({[data.base]: data.rates, timeOfLastFetch: new Date()})
    })
  }

  updateMaxInvestment = (input) => {
    let onlyNumbers = input.replace(/\D/g, '');
    this.setState({maxInvestment:onlyNumbers})
  }

  updateTrade = () => {
    this.setState({trade:!this.state.trade}, ()=>this.startTrades())
  }

  refreshRates = () => {
    console.log("in refresh")
    this.getRates(this.state.allCurrencies)
  }

  changeBaseCurrency = (currency) => {
    let symbol = ""
    switch(currency) {
    case "USD":
        symbol = "$"
        break;
    case "EUR":
        symbol = "€"
        break;
    case "AUD":
        symbol = "A$"
        break;
    case "JPY":
        symbol = "¥"
        break;
    case "GBP":
        symbol = "£"
        break;
    default:
        console.log("error")
    }
    this.setState({baseCurrency:currency, baseCurrencySymbol:symbol})
  }

  startTrades = () => {
    if (this.state.trade){
      let successfulTradePermutations = this.state.tradePermutations.reduce((acc, permutation) => {
        const successfulTrade = this.tradeMagic(permutation);
        if (successfulTrade) {
          acc.unshift(successfulTrade);
        }
        return acc;
      }, []);
      this.setState({
        successfulTrades: [...this.state.successfulTrades, ...successfulTradePermutations]
      });
    }
  }

  tradeMagic = (currencyPermutation) => {
    let baseCurrency = this.state.baseCurrency
    let currentCurrency = this.state.currentCurrency
    let currentMoney = this.state.maxInvestment

    for (let i=0;i<=currencyPermutation.length;i++){
      if (i === 0) {
        currentMoney *= this.state[baseCurrency][currencyPermutation[0]]
        currentCurrency = currencyPermutation[0]
      } else if (i !== currencyPermutation.length && i !== 0) {
        currentMoney *= this.state[currentCurrency][currencyPermutation[1]]
        currentCurrency = currencyPermutation[1]
      } else if(i === currencyPermutation.length){
        currentMoney *= this.state[currentCurrency][baseCurrency]
      } else {
          console.log("error in trademagic")
      }
    }

    let roundedProfits = parseFloat(Math.round((currentMoney-this.state.maxInvestment) * 100) / 100).toFixed(2);
    if (roundedProfits>0){
      let newObject = {best: false, time:this.state.timeOfLastFetch, currencyPermutation:currencyPermutation, profits:roundedProfits, originalInvestment:this.state.maxInvestment, baseCurrencySymbol:this.state.baseCurrencySymbol}
      return newObject;
    } else{
      console.log("no trade")
    }
  }

  render() {
    return (
      <div className="main-container container">
        <h2>Foreign Exchange Arbitrage Simulation</h2>
        <div className= "top-row">
          <Inputs startTrades = {this.startTrades}
                  maxInvestment = {this.state.maxInvestment}
                  updateMaxInvestment = {this.updateMaxInvestment}
                  trade = {this.state.trade}
                  updateTrade = {this.updateTrade}
                  successfulTrades = {this.state.successfulTrades}
                  changeBaseCurrency = {this.changeBaseCurrency}
                  baseCurrency = {this.state.baseCurrency}
                  clearPreviousTrades = {this.clearPreviousTrades}
                  baseCurrencySymbol = {this.state.baseCurrencySymbol}
                  refreshRates = {this.refreshRates}
          />
          <CurrencyRates USD= {this.state.USD}
                         EUR= {this.state.EUR}
                         GBP= {this.state.GBP}
                         AUD= {this.state.AUD}
                         JPY= {this.state.JPY}
          />

        </div>
        <div className = "bottom-row">
          <TradeTable successfulTrades= {this.state.successfulTrades}
                      baseCurrencySymbol = {this.state.baseCurrencySymbol}
          />
        </div>
      </div>
    );
  }
}

export default (MainContainer);
