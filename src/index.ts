import { CronJob } from 'cron'
import { executeCurrencyTask } from './core/executeCurrencyTask'
import { CRON_INTERVALS } from './utils/constants'

const job = new CronJob(CRON_INTERVALS.EVERY_TEN_SECONDS, async () => {
  try {
    await executeCurrencyTask()
  } catch (error) {
    console.log('Unexpected error on CronJob')
    console.log(error)
  }
})

job.start()
