const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
// const sid = 'AC8a7b404d45300fc02a69fbe0f23ce78e'
// const authToken = '33368ab36359842749e3c9c6642b94c9'
// const client = require('twilio')(sid, authToken);
const twilio = require('twilio')
const session = require('express-session')
const cors = require('cors')
const app = express()
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
// in order to keep track of clients
app.use(session({ secret: 'anything-you-want-but-keep-secret' }));
app.use(cors())

// send an sms to a client
//! in trial mode, we need to verify every number we wish to send sms to
//! maybe I should handle sms rejection, and send sucess after recaiving the required info to send sms
//! we can provide message delivery feedback
//! we should add support for messaging services 
app.post('/sms/send', (req, res) => {
  //* don't forget to update it
  const statusHook = 'https://f847-160-178-99-169.ngrok.io/sms/status'
  const { 'x-from': from, 'x-sid': sid, 'x-auth-token': authToken } = req.headers
  const client = twilio(sid, authToken)
  const { to, text } = req.body
  client.messages
    .create({
      body: text,
      from,
      statusCallback: statusHook,
      to
    })
    .then(message => res.send(message))
    .catch(err => res.status(400).send(err))
})

// track dilivery status of messages (webhook)
//! can be secured using twilio.webhook
app.post('/sms/status', (req, res) => {
  const { SmsSid, SmsStatus } = req.body
  console.log('******');
  console.log(SmsSid, SmsStatus);
  // send message deleivery feedback to twilio 
  if (SmsStatus === 'delivered') {
    // console.log('--sending-feedback...')
    // client
    //   .messages(SmsSid)
    //   .feedback
    //   .create({
    //     outcome: 'confirmed',
    //   })
    //   .then(() => {
    //     console.log('--feedback-sent')
    //   })
    //   .catch((err) => {
    //     console.log('--error-sending-feedback')
    //   })
    //   .finally(() => console.log('******'))
  }
  console.log('******');
  res.sendStatus(200)
})

// respond to an sms sent by client (webhook)
//! we can provide a fallback webhook
//! can be secured using twilio.webhook
app.post('/sms/respond', (req, res) => {
  const sms = req.body
  let message = "you are new"
  const { session } = req
  if (session.count) message = `it's your ${session.count} message`
  // remeber the client
  session.count = (session.count + 1) || 1
  const twiml = new MessagingResponse();

  twiml.message(message);

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});