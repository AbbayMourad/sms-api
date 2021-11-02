const twilio = require('twilio')
module.exports = (req, res) => {
    const { 'x-from': from, 'x-sid': sid, 'x-auth-token': authToken } = req.headers
    const client = twilio(sid, authToken)
    const { to, text } = req.body
    client.messages
      .create({
        body: text,
        from,
        to
      })
      .then(message => res.send(message))
      .catch(err => res.status(400).send(err))
}