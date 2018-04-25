var lodash = require('lodash');

describe('createTradePermutations', () => {
  const nonBaseCurrencies = ['EUR', 'GBP', 'JPY', 'AUD']

  it('using map instead of loops: returns a unique set of currencies', () => {
    const joined = nonBaseCurrencies.map((currency) => {
      return nonBaseCurrencies.map((currency2) => {
        return [currency, currency2]
      })
    })
    console.log(lodash.flatten(joined).filter((pair) => pair[0] !== pair[1]))
  })
})
