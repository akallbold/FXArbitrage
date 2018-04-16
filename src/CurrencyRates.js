import React, { Component } from 'react';
import {connect} from "react-redux"


class CurrencyRates extends Component {

  render() {
    return (
      <table className="currency-table">
        <caption>Real Time Exchange Rates </caption>
        <tbody>
          <tr align="center">
            <th>base &#8595;</th>
            <th>USD</th>
            <th>AUD</th>
            <th>EUR</th>
            <th>JPY</th>
            <th>GBP</th>
          </tr>
        </tbody>
        <tbody>
          <tr align="center">
            <th>USD</th>
            <td>{this.props.USD.USD}</td><td>{this.props.USD.AUD}</td><td>{this.props.USD.EUR}</td><td>{this.props.USD.JPY}</td><td>{this.props.USD.GBP}</td>
          </tr>
        </tbody>
        <tbody>
          <tr align="center">
            <th>AUD</th>
            <td>{this.props.AUD.USD}</td><td>{this.props.AUD.AUD}</td><td>{this.props.AUD.EUR}</td><td>{this.props.AUD.JPY}</td><td>{this.props.AUD.GBP}</td>
          </tr>
        </tbody>
        <tbody>
          <tr align="center">
            <th>EUR</th>
            <td>{this.props.EUR.USD}</td><td>{this.props.EUR.AUD}</td><td>{this.props.EUR.EUR}</td><td>{this.props.EUR.JPY}</td><td>{this.props.EUR.GBP}</td>
          </tr>
        </tbody>
        <tbody>
          <tr align="center">
            <th>JPY</th>
            <td>{this.props.JPY.USD}</td><td>{this.props.JPY.AUD}</td><td>{this.props.JPY.EUR}</td><td>{this.props.JPY.JPY}</td><td>{this.props.JPY.GBP}</td>
          </tr>
        </tbody>
        <tbody>
          <tr align="center">
            <th>GBP</th>
            <td>{this.props.GBP.USD}</td><td>{this.props.GBP.AUD}</td><td>{this.props.GBP.EUR}</td><td>{this.props.GBP.JPY}</td><td>{this.props.GBP.GBP}</td>
          </tr>
        </tbody>
      </table>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    USD: state.USD,
    EUR: state.EUR,
    GBP: state.GBP,
    JPY: state.JPY,
    AUD: state.AUD
  }
}

export default connect(mapStateToProps)(CurrencyRates);
