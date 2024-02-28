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
  valueInUsd: number
}
