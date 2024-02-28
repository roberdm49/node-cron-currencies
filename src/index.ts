import { CronJob } from 'cron'
import { executeCurrencyTask } from '@/core/executeCurrencyTask'

const job = new CronJob('', async () => {
  try {
    await executeCurrencyTask()
  } catch (error) {
    console.log('Unexpected error on CronJob')
    console.log(error)
  }
})

job.start()
