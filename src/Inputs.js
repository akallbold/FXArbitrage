import React, { Component } from 'react';
// import {connect} from "react-redux"
// import {changeMaxInvestment, changeBaseCurrency, tradeMagic, toggleTrade} from "./actions"

class Inputs extends Component {

  calculateTotalProfits = () => {
    let output = {trades: 0, totalProfits: 0}
    this.props.successfulTrades.forEach(trade => {
      output.trades++
      output.totalProfits += parseFloat(trade.profits)
    })
    output.totalProfits = parseFloat(Math.round((output.totalProfits) * 100) / 100).toFixed(2);
    return output
  }
  handleChange = (event) => {
    this.props.updateMaxInvestment(event.target.value)
    if (this.props.trade){
      this.props.updateTrade()
    }
  }

  handleClick = (event) => {
    event.preventDefault()
    this.props.updateTrade()
  }

   handleRadioButton = (event) => {
     console.log(event.target.value)
    event.preventDefault()
    this.props.changeBaseCurrency(event.target.value)
  }

  handleClearClick = () => {
    this.props.clearPreviousTrades()
  }

  render() {
    return (
      <div className="input-form">
        <h2>Rates are updated every 60 seconds</h2>
        <form >
          <label>What is your maximum investment? (whole currencies only)</label>
          <br></br>
          <input type= "text"
            value= {this.props.maxInvestment}
            onChange={this.handleChange}></input>
          <br></br>
          <label>What is your base currency?</label>
          <br></br>
          <label>
            <input type="radio" value="USD" name="USD" checked= {this.props.baseCurrency === "USD" ? "true" : "false"} onChange={this.props.changeBaseCurrency} />
            USD
          </label>
          <label>
            <input type="radio" value="EUR" name="EUR" checked= {(this.props.baseCurrency === "EUR") ? "true" : "false"} onChange={this.props.changeBaseCurrency} />
            EUR
          </label>
          <label>
            <input type="radio" value="AUD" name="AUD" checked= {this.props.baseCurrency === "AUD" ? "true" : "false"} onChange={this.props.changeBaseCurrency} />
            AUD
          </label>
          <label>
            <input type="radio" value="JPY" name="JPY" checked= {this.props.baseCurrency === "JPY" ? "true" : "false"} onChange={this.props.changeBaseCurrency} />
            JPY
          </label>
          <label>
            <input type="radio" value="GBP" name="GBP" checked= {this.props.baseCurrency === "GBP" ? "true" : "false"} onChange={this.props.changeBaseCurrency} />
            GBP
          </label>

          <button onClick = {this.handleClick}>
            {this.props.trade ? "Stop Trading" :  "Start Trading"}
          </button>
        </form>

        <h4>Results: </h4>
        <h6>{`Total Trades: ${this.calculateTotalProfits().trades}`}</h6>
        <h6>{`Total Profits: $${this.calculateTotalProfits().totalProfits}`}</h6>

        <button onClick = {this.handleClearClick}>
          Clear Previous Trades
        </button>
      </div>
    );
  }
}

  // const mapStateToProps = (state) => {
  //   return {
  //     allCurrencies:state.allCurrencies,
  //     maxInvestment:state.maxInvestment,
  //     baseCurrency:state.baseCurrency,
  //     tradeOn: state.tradeOn
  //   }
  // }

export default (Inputs);
