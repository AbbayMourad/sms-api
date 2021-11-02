const http = require('http');
const express = require('express');
const app = express()
const cors = require('cors')
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(cors())

const sendSms = require('./sms/send')
app.post('/sms/send', sendSms)

const port = process.env.port || 1337
http.createServer(app).listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});