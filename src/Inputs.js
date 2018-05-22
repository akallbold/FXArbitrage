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
      <div className="space-right col s6 ">
        <form>
          <label className="blackfont"> {`What is your maximum investment (in ${this.props.baseCurrencySymbol}) ?`}
          <input type= "text"
            value= {this.props.maxInvestment}
            placeholder = {this.props.baseCurrencySymbol}
            onChange={this.handleChange}></input>
          </label>
          <br></br>
          <label className="blackfont">What is your base currency?</label>
          <br></br>
          <form className="currency-radio-buttons">
              <label>
                <input type="radio" value="USD" name="currency" checked= {this.props.baseCurrency === "USD"} onChange={this.handleRadioButton}/>
                <span>USD</span>
              </label>
              <label>
                <input type="radio" value="EUR" name="currency" checked= {this.props.baseCurrency === "EUR"} onChange={this.handleRadioButton}/>
                <span>EUR</span>
              </label>
              <label>
                <input type="radio" value="AUD" name="currency" checked= {this.props.baseCurrency === "AUD"} onChange={this.handleRadioButton}/>
                <span>AUD</span>
              </label>
              <label>
                <input type="radio" value="GBP" name="currency" checked= {this.props.baseCurrency === "GBP"} onChange={this.handleRadioButton}/>
                <span>GBP</span>
              </label>
              <label>
                <input type="radio" value="JPY" name="currency" checked= {this.props.baseCurrency === "JPY"} onChange={this.handleRadioButton}/>
                <span>JPY</span>
              </label>
        </form>

          <button className= "btn waves-effect" onClick = {this.handleClick}>
            {this.props.trade ? "Stop" :  "Start"}
          </button>
        </form>

        <h6>Results: </h6>
        <p>{`Total Trades: ${this.calculateTotalProfits().trades}`}</p>
        <p>{`Total Profits: $${this.calculateTotalProfits().totalProfits}`}</p>

        <button className= "btn space" onClick = {this.handleClearClick}>
          Clear
        </button>

        <button className= "btn space"  onClick = {this.handleRefreshClick}>
          Refresh
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
