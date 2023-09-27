import express from 'express';
import twilio from 'twilio';

const PhoneRouter = express.Router();


PhoneRouter.get('/', (req, res) => {
  res.send("welcome");
});

PhoneRouter.post('/send-sms', (req, res) => {
  const { name, mobile } = req.body;

  const client = twilio(
    'AC8af3cee6e9b48bc5231528e9179f8630',
    'ccc37b6ea1491986c50dba6fa056058a'
  );

  client.messages
    .create({
      body: `Name: ${name}, Mobile: ${mobile}`,
      from: '+18146662447',
      to: '+919876543210',
    })
    .then((message) => {
      console.log('Message sent:', message.sid);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error sending message:', error);
      res.sendStatus(500);
    });
});


export default PhoneRouter