import Big from 'big.js'
import { ApiExpectedCurrencyStructure, CurrencyData } from '@/types'
import { ISO_NUMS } from '@/utils/constants'

export const getStructuredCurrencies = (currenciesData: CurrencyData[]): ApiExpectedCurrencyStructure[] => {
  let usdReferenceValue = null
  const rawCurrencies = []
  const structuredCurrencies = []

  for (const currency of currenciesData) {
    const isoCode = currency.moneda

    if (isoCode === 'USD') {
      usdReferenceValue = new Big(currency.compra)
    } else {
      rawCurrencies.push(currency)
    }
  }

  if (!usdReferenceValue) {
    throw new Error('Main currency reference (USD) is missing!')
  }

  for (const rawCurrency of rawCurrencies) {
    const currentCurrencyValue = new Big(rawCurrency.compra)
    const normalizedCurrentCurrencyValue = currentCurrencyValue.div(usdReferenceValue).toNumber()

    const currency: ApiExpectedCurrencyStructure = {
      name: rawCurrency.nombre,
      isoCode: rawCurrency.moneda,
      isoNum: ISO_NUMS[rawCurrency.moneda],
      valueInUsd: normalizedCurrentCurrencyValue
    }

    structuredCurrencies.push(currency)
  }

  // particular case, has to be done manually
  const arsCurrencyValue = new Big(1)
  const normalizedArsCurrencyValue = arsCurrencyValue.div(usdReferenceValue).toNumber()
  const ars: ApiExpectedCurrencyStructure = {
    name: 'Pesos argentinos',
    isoCode: 'ARS',
    isoNum: ISO_NUMS.ARS,
    valueInUsd: normalizedArsCurrencyValue
  }

  structuredCurrencies.push(ars)
  return structuredCurrencies
}
