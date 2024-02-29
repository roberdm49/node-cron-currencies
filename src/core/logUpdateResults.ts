import chalk from 'chalk'

export const logUpdateResults = (matchedCurrencies: string[], nonMatchedCurrencies: string[]): void => {
  console.log(chalk.bold.greenBright(`Modified currencies: ${JSON.stringify(matchedCurrencies)}`))
  console.log(chalk.bold.yellowBright(`Non-modified currencies: ${JSON.stringify(nonMatchedCurrencies)}`))
}
