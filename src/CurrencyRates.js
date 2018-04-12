import React, { Component } from 'react';
// import ReactTable from 'react-table'
import {connect} from "react-redux"


class CurrencyRates extends Component {

  render() {
    // debugger
    // {this.props.rates["USD"]["USD"]}
    console.log("rates", this.props.rates)
    return (
      <table className="currency-table">
        <caption>Real Time Exchange Rates </caption>
        <tr>
          <th></th>
          <th>USD</th>
          <th>AUD</th>
          <th>EUR</th>
          <th>JPY</th>
          <th>GBP</th>
        </tr>
        <tr>
          <th>USD</th>
          <td>data</td><td>data</td><td>data</td><td>data</td><td>data</td>
        </tr>
        <tr>
          <th>AUD</th>
          <td>data</td><td>data</td><td>data</td><td>data</td><td>data</td>
        </tr>
        <tr>
          <th>EUR</th>
          <td>data</td><td>data</td><td>data</td><td>data</td><td>data</td>
        </tr>
        <tr>
          <th>JPY</th>
          <td>data</td><td>data</td><td>data</td><td>data</td><td>data</td>
        </tr>
        <tr>
          <th>GBP</th>
          <td>data</td><td>data</td><td>data</td><td>data</td><td>data</td>
        </tr>
      </table>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    rates: state.rates
  }
}

export default connect(mapStateToProps)(CurrencyRates);
