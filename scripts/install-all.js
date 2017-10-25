const npmRun = require('./lib/npm-run')

Promise.all([
  npmRun('./packages/client', ['install']),
  npmRun('./packages/server', ['install'])
]).catch(err => console.error('Unexpected Error:', err))
