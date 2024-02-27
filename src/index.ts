import { CronJob } from 'cron'
import axios, { AxiosResponse } from 'axios'
import { CURRENCY_PATHS, GlobalEnv, ISO_NUMS } from './utils/constants'
import Big from 'big.js'

console.log('executing index')

interface CurrencyData {
  moneda: string
  casa: string
  nombre: string
  compra: number
  venta: number
  fechaActualizacion: string
}

interface ApiExpectedCurrencyStructure {
  name: string
  isoCode: string
  isoNum: string
  valueInUsd: number
}

const getCurrenciesMap = async (): Promise<Map<string, CurrencyData>> => {
  const currencyMap = new Map<string, CurrencyData>()

  const [usdResponse, eurResponse, brlResponse]: Array<AxiosResponse<CurrencyData>> = await Promise.all([
    axios.get<CurrencyData>(`${GlobalEnv.EXTERNAL_CURRENCY_API_BASE_URL}/${CURRENCY_PATHS.USD}`),
    axios.get<CurrencyData>(`${GlobalEnv.EXTERNAL_CURRENCY_API_BASE_URL}/${CURRENCY_PATHS.EUR}`),
    axios.get<CurrencyData>(`${GlobalEnv.EXTERNAL_CURRENCY_API_BASE_URL}/${CURRENCY_PATHS.BRL}`)
  ])

  currencyMap.set('usd', usdResponse.data)
  currencyMap.set('eur', eurResponse.data)
  currencyMap.set('brl', brlResponse.data)

  return currencyMap
}

const getStructuredCurrencies = (currenciesMap: Map<string, CurrencyData>): ApiExpectedCurrencyStructure[] => {
  const usdData = currenciesMap.get('usd')
  const eurData = currenciesMap.get('eur')
  const brlData = currenciesMap.get('brl')

  if (!usdData || !eurData || !brlData) {
    throw new Error('Some currencies are not availables!')
  }

  const referenceUsdValue = new Big(usdData.compra)

  const referenceArsValue = new Big(1)
  const referenceEurValue = new Big(eurData.compra)
  const referenceBrlValue = new Big(brlData.compra)

  // This is the only currency which is different to the rest!
  // Because the currencies have the ARS as reference, but
  // the reference should be the USD
  const ars: ApiExpectedCurrencyStructure = {
    name: 'Pesos argentinos',
    isoCode: 'ARS',
    isoNum: ISO_NUMS.ARS,
    valueInUsd: referenceArsValue.div(referenceUsdValue).toNumber()
  }

  const eur: ApiExpectedCurrencyStructure = {
    name: eurData.nombre,
    isoCode: eurData.moneda,
    isoNum: ISO_NUMS.EUR,
    valueInUsd: referenceEurValue.div(referenceUsdValue).toNumber()
  }

  const brl: ApiExpectedCurrencyStructure = {
    name: brlData.nombre,
    isoCode: brlData.moneda,
    isoNum: ISO_NUMS.BRL,
    valueInUsd: referenceBrlValue.div(referenceUsdValue).toNumber()
  }

  const structuredCurrencies = [ars, eur, brl]
  return structuredCurrencies
}

const job = new CronJob('*/10 * * * * *', async () => {
  try {
    const currenciesMap = await getCurrenciesMap()
    console.log(currenciesMap)
    const structuredCurrencies = getStructuredCurrencies(currenciesMap)
    console.log(structuredCurrencies)
    // const sentCurrencies = await sendCurrencies()
  } catch (error) {
    console.log(error)
  }
})

job.start()
