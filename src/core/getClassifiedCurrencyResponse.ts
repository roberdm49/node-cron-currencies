import { ApiExpectedCurrencyStructureToReceive, ApiExpectedCurrencyStructureToSend, ClassifiedCurrencies } from '@/types'

export const getClassifiedCurrencyResponse = (
  sentData: ApiExpectedCurrencyStructureToSend[],
  responseData: ApiExpectedCurrencyStructureToReceive[]
): ClassifiedCurrencies => {
  const targetObj: { [key: string]: boolean } = {}

  const matchedCurrencies: string[] = []
  const nonMatchedCurrencies: string[] = []

  for (const receivedCurrency of responseData) {
    const { isoCode } = receivedCurrency
    targetObj[isoCode] = true
  }

  for (const sentCurrency of sentData) {
    const { isoCode } = sentCurrency
    if (Object.prototype.hasOwnProperty.call(targetObj, isoCode)) {
      matchedCurrencies.push(isoCode)
    } else {
      nonMatchedCurrencies.push(isoCode)
    }
  }

  return {
    matchedCurrencies,
    nonMatchedCurrencies
  }
}
