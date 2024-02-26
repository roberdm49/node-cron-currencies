import { CronJob } from 'cron'

const job = new CronJob('*/5 * * * * *', () => {
  console.log('Cron job executed!')
})

job.start()
