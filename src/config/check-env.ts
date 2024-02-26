import fs from 'fs'
import dotenv from 'dotenv'
import chalk from 'chalk'

const EXAMPLE_ENV_PATH = '.env.example'
const exampleEnvContent = fs.readFileSync(EXAMPLE_ENV_PATH, 'utf-8')
const exampleEnvLines = exampleEnvContent.split('\n')
const exampleEnvVariables = exampleEnvLines
  .filter(line => !line.trim().startsWith('#') && line.trim() !== '')
  .map(line => line.split('=')[0].trim())

dotenv.config({ path: '.env' })

const missingVariables = exampleEnvVariables.filter(variable => {
  const value = process.env[variable]
  return !value || value.trim() === ''
})

if (missingVariables.length > 0) {
  console.error(chalk.underline.bold.red('Error: The following variables have no value in the .env file:'))
  missingVariables.forEach(missingVariable => console.log(chalk.red(`- ${missingVariable}`)))
  process.exit(1)
} else {
  console.log(chalk.bold.green('All variables in .env.example are filled in .env.'))
}
