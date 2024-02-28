import { CronJob } from 'cron'
import axios, { AxiosResponse } from 'axios'
import Big from 'big.js'
import { GlobalEnv, CURRENCY_PATHS, ISO_NUMS } from './utils/constants'
import { ApiExpectedCurrencyStructure, CurrencyData } from './types'

console.log('executing index')

const getCurrenciesData = async (): Promise<CurrencyData[]> => {
  const currencyPromises = []

  for (const currencyPath of Object.values(CURRENCY_PATHS)) {
    currencyPromises.push(
      axios.get<CurrencyData>(`${GlobalEnv.EXTERNAL_CURRENCY_API_BASE_URL}/${currencyPath}`)
    )
  }

  const currencyResolvedPromises: Array<AxiosResponse<CurrencyData>> = await Promise.all(currencyPromises)
  const currenciesData = currencyResolvedPromises.map(response => response.data)

  if (currencyResolvedPromises.length !== Object.keys(CURRENCY_PATHS).length) {
    throw new Error(`The number of promises is different than the expected. Should be ${Object.keys(CURRENCY_PATHS).length} promises and there is ${currencyResolvedPromises.length} of them`)
  }

  return currenciesData
}

const getStructuredCurrencies = (currenciesData: CurrencyData[]): ApiExpectedCurrencyStructure[] => {
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

const sendCurrencies = async (payload: ApiExpectedCurrencyStructure[]): Promise<AxiosResponse> => {
  return await axios.post(GlobalEnv.INTERNAL_CURRENCY_API_URL, payload, {
    headers: {
      Authorization: `Bearer ${GlobalEnv.CRON_SECRET}`
    }
  })
}

const executeCurrencyTask = async (): Promise<void> => {
  try {
    const currenciesData = await getCurrenciesData()
    const structuredCurrencies = getStructuredCurrencies(currenciesData)
    const sentCurrencies = await sendCurrencies(structuredCurrencies)
    console.log({ sentCurrencies })
  } catch (error) {
    console.log(error)
  }
}

const job = new CronJob('*/10 * * * * *', async () => {
  try {
    await executeCurrencyTask()
  } catch (error) {
    console.log('Unexpected error on CronJob')
    console.log(error)
  }
})

job.start()
