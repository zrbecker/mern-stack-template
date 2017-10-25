const os = require('os')
const {spawn} = require('child_process')

const npmCommand = os.platform() === 'win32' ? 'npm.cmd' : 'npm'

function npmRun(packageDir, args) {
  return new Promise((res, rej) => {
    const npmProcess = spawn(npmCommand, args, {cwd: packageDir})
    npmProcess.stdout.on('data', data => console.log(data.toString()))
    npmProcess.stderr.on('data', data => console.error(data.toString()))
    npmProcess.on('close', code => {
      console.log(`npm install on ${packageDir} completed with exit code ${code}`)
      res(code)
    })
  })
}

module.exports = npmRun
