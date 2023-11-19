Deno.cron('sample cron', '*/10 * * * *', () => {
  console.log('cron job executed every 10 minutes')
})
