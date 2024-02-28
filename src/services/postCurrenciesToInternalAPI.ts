import axios, { AxiosResponse } from 'axios'
import { ApiExpectedCurrencyStructure } from '@/types'
import { GlobalEnv } from '@/utils/constants'

export const postCurrenciesToInternalAPI = async (payload: ApiExpectedCurrencyStructure[]): Promise<AxiosResponse> => {
  const requestConfig = {
    headers: {
      Authorization: `Bearer ${GlobalEnv.CRON_SECRET}`
    }
  }

  return await axios.post(GlobalEnv.INTERNAL_CURRENCY_API_URL, payload, requestConfig)
}
