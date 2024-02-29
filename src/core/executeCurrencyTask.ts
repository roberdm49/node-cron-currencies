import { getCurrenciesFromExternalAPI, postCurrenciesToInternalAPI } from '@/services'
import { getStructuredCurrencies } from './getStructuredCurrencies'
import { getClassifiedCurrencyResponse } from './getClassifiedCurrencyResponse'
import { logUpdateResults } from './logUpdateResults'

export const executeCurrencyTask = async (): Promise<void> => {
  try {
    const currenciesData = await getCurrenciesFromExternalAPI()
    const currenciesToSend = getStructuredCurrencies(currenciesData)
    const receivedCurrencies = await postCurrenciesToInternalAPI(currenciesToSend)
    const { matchedCurrencies, nonMatchedCurrencies } = getClassifiedCurrencyResponse(currenciesToSend, receivedCurrencies)
    logUpdateResults(matchedCurrencies, nonMatchedCurrencies)
  } catch (error) {
    console.log(error)
  }
}
