# sms-api

### Endpoints

#### Send an SMS
```http
POST http://localhost:1337/sms/send
Content-Type: application/json
x-sid: {your-twilio-sid}
x-auth-token: {your-twilio-auth-token}
x-from: {your-twilio-number}

{
  "to": "{to_number}",
  "text": "it's an sms"
}
```
