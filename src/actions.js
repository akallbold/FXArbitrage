let APIkey = "2767d0a1c62b3994f53e607c7887500f"

export let changeMaxInvestment = (event) => {
  // console.log("working")
  return {
    type:"CHANGE_MAX_INVESTMENT",
    payload:event.target.value
  }
}

export let changeBaseCurrency = (event) => {
  return {
    type:"CHANGE_BASE_CURRENCY",
    payload:event.target.value
  }
}

export let changeCurrentMoney = () => {
  return {
    type:"CHANGE_CURRENT_MONEY"
  }
}
export let exchange = ([base,futureCurrency]) => {
  return {
    type:"EXCHANGE",
    payload:[base,futureCurrency]
  }
}

export function fetchRates(currencyArray, ratesArray) {
  return function (dispatch){
    currencyArray.forEach(currency => {
      return fetch(`http://data.fixer.io/api/latest?access_key=${APIkey}&base=${currency}&symbols=USD,AUD,EUR,JPY,GBP`)
        .then(response => response.json())
        .then(data => {
          dispatch({type:"FETCH_RATES", payload:data})
        })
    })
  }
}

export let increaseTradeCount = () => {
  return {
    type:"INCREASE_TRADE_COUNT"
  }
}

export let startTrades = () => {
  return {
    type:"START_TRADES",
    payload:""
  }
}

export let createTradePermutations = () => {
  return {
    type:"CREATE_TRADE_PERMUTATIONS"
  }
}

export let toggleTrade = () => {
  console.log("in toggle trade on actions")
  return {
    type:"TOGGLE_TRADE"
  }
}

export let updateCurrency = (currency) => {
  return {
    type:"UPDATE_CURRENCY",
    payload: currency
  }
}
