const express = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Login = require('./models/Login');
require('dotenv').config();
const cors = require('cors');



const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo error:', err));


app.post('/generate-token', async (req, res) => {
  const phonenumber = req.body.phonenumber;
  const token = uuidv4();
  const newLogin = new Login({ token, phonenumber });
  await newLogin.save();
  const whatsappMessage = `Hi, my login token is: ${token}`;
  const encodedMessage = encodeURIComponent(whatsappMessage);

  const whatsappLink = `https://wa.me/7354887111?text=${encodedMessage}`;

  res.json({
    phonenumber,
    token,
    link: whatsappLink
  });
});



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
app.use(express.static('public'));
