import React, { Component } from 'react';
import {connect} from "react-redux"
import {changeMaxInvestment, changeBaseCurrency} from "./actions"
// JPY GBP AUD CAD SISSFRANC CHINESE YUAN MEXPESO SEK

class Inputs extends Component {

  render() {
    return (
      <div className="trade-table">
        <form>
          <label>What is your maximum investment?</label>
          <br></br>
          <input type= "text" value= {this.props.maxInvestment} onChange={this.props.changeMaxInvestment}></input>
          <br></br>
          <label>What is your base currency?</label>
          <br></br>
          <input type="radio" value="USD" name="USD" checked="true" onChange={this.props.changeBaseCurrency} />
          <input type="radio" value="EUR" name="EUR" onChange={this.props.changeBaseCurrency} />
        </form>
      </div>
    );
  }
}

  const mapStateToProps = (state) => {
    return {
      maxInvestment:state.maxInvestment,
      baseCurrency:state.baseCurrency
    }
  }

export default connect(mapStateToProps, {changeMaxInvestment, changeBaseCurrency})(Inputs);
