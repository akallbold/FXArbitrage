import React, { Component } from 'react';
// import {connect} from "react-redux"
// import {changeMaxInvestment, changeBaseCurrency, tradeMagic, toggleTrade} from "./actions"

class Inputs extends Component {

  calculateTotalProfits = () => {
    let output = {trades: 0, totalProfits: 0}
    this.props.successfulTrades.forEach(trade => {
      // debugger
      output.trades++
      output.totalProfits += parseFloat(trade.profits)
    })
    output.totalProfits = parseFloat(Math.round((output.totalProfits) * 100) / 100).toFixed(2);
    return output
  }
  handleChange = (event) => {
    this.props.updateMaxInvestment(event.target.value)
  }

  handleClick = (event) => {
    event.preventDefault()
    this.props.updateTrade()
  }

  render() {
    return (
      <div className="input-form">
        <form >
          <label>What is your maximum investment? (whole currencies only)</label>
          <br></br>
          <input type= "text"
            value= {this.props.maxInvestment}
            onChange={this.handleChange}></input>
          <br></br>
          <label>What is your base currency?</label>
          <br></br>
          <input type="radio" value="USD" name="USD" checked="true" onChange={this.props.changeBaseCurrency} />
          <input type="radio" value="EUR" name="EUR" onChange={this.props.changeBaseCurrency} />
          <br></br>
          <button
            onClick= {this.handleClick}
          >
            {this.props.trade ? "Stop Trading" :  "Start Trading"}
          </button>
        </form>

        <h4>Results: </h4>
        <h6>{`Total Trades: ${this.calculateTotalProfits().trades}`}</h6>
        <h6>{`Total Profits: $${this.calculateTotalProfits().totalProfits}`}</h6>
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
