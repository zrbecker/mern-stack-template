const express = require('express')
const bodyParser = require('body-parser')

const app = express()

let count = 23

app.use(bodyParser.json())

app.get('/count', (req, res) => {
    res.json({count})
})

app.post('/count', (req, res) => {
    const newCount = Number(req.body['count'])
    count = newCount
    res.send()
})

app.listen(3000, () => console.log('http://127.0.0.1:3000'))
