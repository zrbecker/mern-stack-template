const express = require('express')
const bodyParser = require('body-parser')

const app = express()

let count = 0

app.use(bodyParser.json())

app.get('/count', (req, res) => {
  res.set({'Cache-control': 'no-cache'})
  res.json({count})
})

app.put('/count', (req, res) => {
  const data = req.body
  
  if (data && typeof data.increment === 'number') {
    count += data.increment
  } else if (data && data.reset) {
    count = 0
  } else {
    return res.sendStatus(400)
  }

  res.json({count})
})

app.listen(3000, () => console.log('http://127.0.0.1:3000'))
