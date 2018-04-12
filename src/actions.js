let APIkey = ""
export let changeMaxInvestment = (event) => {
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

export function fetchRates(currencyArray, ratesArray) {
  return function (dispatch){
    currencyArray.forEach(currency => {
      return fetch(`http://data.fixer.io/api/latest?access_key=${APIkey}&base=${currency}&symbols=USD,AUD,EUR,JPY,GBP`)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          console.log("ratesarray", ratesArray)
          ratesArray[currency]=data.rates
        })
    })

  //   .then(data => {
  //     dispatch({type:"FETCH_RATES", payload:data})
  //   })
  }
}
