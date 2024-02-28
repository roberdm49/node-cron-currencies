import { getCurrenciesFromExternalAPI, postCurrenciesToInternalAPI } from '@/services'
import { getStructuredCurrencies } from './getStructuredCurrencies'

export const executeCurrencyTask = async (): Promise<void> => {
  try {
    const currenciesData = await getCurrenciesFromExternalAPI()
    const structuredCurrencies = getStructuredCurrencies(currenciesData)
    const sentCurrencies = await postCurrenciesToInternalAPI(structuredCurrencies)
    console.log({ sentCurrencies })
  } catch (error) {
    console.log(error)
  }
}
