import axios from 'axios'
import { ApiExpectedCurrencyStructureToReceive, ApiExpectedCurrencyStructureToSend } from '@/types'
import { GlobalEnv } from '@/utils/constants'

interface InternalApiDataResponse {
  updatedCurrencies: ApiExpectedCurrencyStructureToReceive[]
}

export const postCurrenciesToInternalAPI = async (payload: ApiExpectedCurrencyStructureToSend[]): Promise<ApiExpectedCurrencyStructureToReceive[]> => {
  const requestConfig = {
    headers: {
      Authorization: `Bearer ${GlobalEnv.CRON_SECRET}`
    }
  }

  const response = await axios.post<InternalApiDataResponse>(GlobalEnv.INTERNAL_CURRENCY_API_URL, payload, requestConfig)

  const { updatedCurrencies } = response.data
  return updatedCurrencies
}
