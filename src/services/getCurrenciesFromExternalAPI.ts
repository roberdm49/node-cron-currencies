import fs from 'fs'
import path from 'path'
import axios, { AxiosResponse } from 'axios'
import chalk from 'chalk'
import { CurrencyData } from '@/types'
import { CURRENCY_PATHS, GlobalEnv } from '@/utils/constants'

export const getCurrenciesFromExternalAPI = async (): Promise<CurrencyData[]> => {
  if (GlobalEnv.NODE_ENV === 'development') {
    return await getDataFromMock()
  }

  return await getDataFromAPI()
}

const getDataFromMock = async (): Promise<CurrencyData[]> => {
  console.log(chalk.yellowBright('Retrieving data from mock'))

  const mockFilePath = path.join(__dirname, '../mock/currenciesFromExternalApi.json')
  const mockData = fs.readFileSync(mockFilePath, 'utf8')
  return JSON.parse(mockData)
}

const getDataFromAPI = async (): Promise<CurrencyData[]> => {
  console.log(chalk.cyanBright('Retrieving data from external API'))

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
