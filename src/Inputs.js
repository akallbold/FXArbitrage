import React, { Component } from 'react';
// import {connect} from "react-redux"
// import {changeMaxInvestment, changeBaseCurrency, tradeMagic, toggleTrade} from "./actions"

class Inputs extends Component {


  handleChange = (event) => {
    this.props.updateMaxInvestment(event.target.value)
  }

  handleClick = (event) => {
    event.preventDefault()
    this.props.updateTrade()
    this.props.startTrades()
  }

  render() {
    return (
      <div className="input-form">
        <form >
          <label>What is your maximum investment?</label>
          <br></br>
          <input type= "text"
            value= {this.props.maxInvestment}
            onChange={this.handleChange}></input>
          <br></br>
          {/* <label>What is your base currency?</label>
          <br></br>
          <input type="radio" value="USD" name="USD" checked="true" onChange={this.props.changeBaseCurrency} />
          <input type="radio" value="EUR" name="EUR" onChange={this.props.changeBaseCurrency} />
          <br></br> */}
          <button
            onClick= {this.handleClick}
          >
            {this.props.trade ? "Stop Trading" :  "Start Trading"}
          </button>
        </form>
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
