export interface CurrencyData {
  moneda: string
  casa: string
  nombre: string
  compra: number
  venta: number
  fechaActualizacion: string
}

export interface ApiExpectedCurrencyStructure {
  name: string
  isoCode: string
  isoNum: string
}

export type ApiExpectedCurrencyStructureToSend = ApiExpectedCurrencyStructure & {
  valueInUsd: number
}

export type ApiExpectedCurrencyStructureToReceive = ApiExpectedCurrencyStructure & {
  id: string
  latestExchangeRateId?: string
}

export interface ClassifiedCurrencies {
  matchedCurrencies: string[]
  nonMatchedCurrencies: string[]
}
