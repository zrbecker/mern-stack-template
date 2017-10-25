const npmRun = require('./lib/npm-run')

Promise.all([
  npmRun('./packages/client', ['start']),
  npmRun('./packages/server', ['start'])
]).catch(err => console.error('Unexpected Error:', err))
