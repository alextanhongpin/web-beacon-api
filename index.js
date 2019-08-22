const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const formidableMiddleware = require('express-formidable')
const cors = require('cors')

app.use(cors())
// To handle FormData from the client side.
app.use(formidableMiddleware())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.post('/', (req, res) => {
  // console.log(req.body)
  // console.log(req.params)
  // console.log(req.query)
  console.log(req.fields)
  res.json({ ok: true })
})

app.listen(8080, err => {
  if (err) throw err
  console.log('listening to port *:8080. press ctrl+c to cancel')
})
