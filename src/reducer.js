const defaultState = {
  allCurrencies:["USD", "EUR", "GBP", "JPY", "AUD"],
  baseCurrency: "USD",
  currentCurrency: "USD",
  currentExchange:1,
  currentMoney: 0,
  futureCurrency: "USD",
  maxInvestment: 0,
  nonBaseCurrencies:["EUR", "GBP", "JPY", "AUD"],
  numberOfTrades:0,
  rates:[]
}

const fxReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "CHANGE_MAX_INVESTMENT":
      return {...state, maxInvestment:action.payload}
    case "CHANGE_BASE_CURRENCY":
      let nonBaseCurrencies = state.allCurrencies.filter(currency => {
        return currency !== action.payload
      })
      console.log(nonBaseCurrencies)
      return {...state, baseCurrency:action.payload, nonBaseCurrencies:nonBaseCurrencies}
    case "FETCH_RATES":
      return {...state, rates:action.payload}
    default:
      return state
  }
}

export default fxReducer
