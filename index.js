const express = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Login = require('./models/Login');
require('dotenv').config();
const cors = require('cors');
const path = require('path');



const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo error:', err));


app.post('/generate-token', async (req, res) => {
  const phonenumber = req.body.phonenumber;
  const token = uuidv4();
  const currtime = new Date().toISOString();
  const expirytime = new Date(Date.now() + 5 * 60 * 1000).toISOString();


  const newLogin = new Login({ token, phonenumber ,currtime, expirytime });
  await newLogin.save();
  const whatsappMessage = `Hi, my login token is: ${token}`;
  const encodedMessage = encodeURIComponent(whatsappMessage);

  const whatsappLink = `https://wa.me/7354887111?text=${encodedMessage}`;

  res.json({
    phonenumber,
    token,
    currtime,
    expirytime,
    link: whatsappLink
  });
});


app.get('/verify-token', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const login = await Login.findOne({ token });

    if (!login) {
      return res.status(404).json({ error: 'Token not found' });
    }

    if (login.loginstatus) {
      return res.redirect('used.html');
    }

    const loginTime = new Date();
    const expiryTime = new Date(login.expirytime);

    if (new Date(loginTime) > new Date(expiryTime)) {
      return res.status(400).json({ error: 'Token has expired' });
    }

    login.loginstatus = true;
    await login.save();

    // res.json({
    //   phonenumber: login.phonenumber,
    //   logintime: loginTime,
    //   expirytime: login.expirytime
    // });
    res.redirect('login.html');
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

