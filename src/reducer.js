const defaultState = {
  allCurrencies:["USD", "EUR", "GBP", "JPY", "AUD"],
  baseCurrency: "USD",
  currentCurrency: "USD",
  currentExchange:1,
  currentMoney: 0,
  maxInvestment: 100000000,
  nonBaseCurrencies:["EUR", "GBP", "JPY", "AUD"],
  numberOfTrades:0,
  tradeOn: false,
  tradePermutations:[],
  USD:{},
  EUR:{},
  GBP:{},
  JPY:{},
  AUD:{}
}

const fxReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "CHANGE_CURRENT_MONEY":
    // debugger
      return {...state, currentMoney:state.maxInvestment}
    case "CHANGE_MAX_INVESTMENT":
      return {...state, maxInvestment:action.payload}
    case "CHANGE_BASE_CURRENCY":
      let nonBaseCurrencies = state.allCurrencies.filter(currency => {
        return currency !== action.payload
      })
      return {...state, baseCurrency:action.payload, nonBaseCurrencies:nonBaseCurrencies}
    case "CREATE_TRADE_PERMUTATIONS":
      let tradeArray = []
      for (let i=0;i<state.nonBaseCurrencies.length;i++){
        let currentArray = []
        for (let j=0;j<state.nonBaseCurrencies.length;j++){
          currentArray.push(state.nonBaseCurrencies[i])
          if (!currentArray.includes(state.nonBaseCurrencies[j])){
            currentArray.push(state.nonBaseCurrencies[j])
            let uniqueItems = Array.from(new Set(currentArray))
            tradeArray.push(uniqueItems)
            currentArray=[]
          }
        }
      }
      return {...state, tradePermutations:tradeArray}
    case "EXCHANGE":
      let newMoney = state.currentMoney*state[action.payload[0]][action.payload[1]]
      // debugger
      return {...state, currentMoney:newMoney}
    case "FETCH_RATES":
      return {...state,[action.payload.base]:action.payload.rates}
    case "INCREASE_TRADE_COUNT":
      return {...state, numberOfTrades:state.numberOfTrades++}
    case "TOGGLE_TRADE":
    debugger
      console.log("in toggletrade on reducer")

      return {...state, tradeOn:!state.tradeOn}
    case "UPDATE_CURRENCY":
      return {...state, currentCurrency:action.payload}
    default:
      return state
  }
}

export default fxReducer
