import React, { Component } from 'react';

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
    event.preventDefault()
    this.props.changeBaseCurrency(event.target.value)
  }

  handleClearClick = () => {
    this.props.clearPreviousTrades()
  }

  handleRefreshClick = () => {
    console.log("in handle")
    this.props.refreshRates()
  }

  render() {
    return (
      <div className="input-form col s6">
        <h3>Inputs</h3>
        <form >
          <label>{`What is your maximum investment?`}<br></br>{`(whole ${this.props.baseCurrencySymbol} only)`}
          <br></br>
          <input type= "text"
            value= {this.props.maxInvestment}
            placeholder = {this.props.baseCurrencySymbol}
            onChange={this.handleChange}></input>
          </label>
          <br></br>
          <label>What is your base currency?</label>
          <br></br>
          <label>
            <input type="radio" value="USD" name="currency" defaultChecked= {this.props.baseCurrency === "USD"} onChange={this.handleRadioButton} />
            USD
          </label>
          <label>
            <input type="radio" value="EUR" name="currency" defaultChecked= {this.props.baseCurrency === "EUR"} onChange={this.handleRadioButton} />
            EUR
          </label>
          <label>
            <input type="radio" value="AUD" name="currency" defaultChecked= {this.props.baseCurrency === "AUD"} onChange={this.handleRadioButton} />
            AUD
          </label>
          <label>
            <input type="radio" value="JPY" name="currency" defaultChecked= {this.props.baseCurrency === "JPY"} onChange={this.handleRadioButton} />
            JPY
          </label>
          <label>
            <input type="radio" value="GBP" name="currency" defaultChecked= {this.props.baseCurrency === "GBP"} onChange={this.handleRadioButton} />
            GBP
          </label>
          <br></br>
          <br></br>
          <button className= "btn" onClick = {this.handleClick}>
            {this.props.trade ? "Stop Trading" :  "Start Trading"}
          </button>
        </form>

        <h4>Results: </h4>
        <h5>{`Total Trades: ${this.calculateTotalProfits().trades}`}</h5>
        <h5>{`Total Profits: $${this.calculateTotalProfits().totalProfits}`}</h5>

        <button className= "btn" onClick = {this.handleClearClick}>
          Clear Previous Trades
        </button>
        <br></br>
        <button className= "btn"  onClick = {this.handleRefreshClick}>
          Refresh Rates
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
