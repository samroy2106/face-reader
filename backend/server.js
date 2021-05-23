const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

db.select('*').from('users').then(data => {
  console.log(data);
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (request, response) => {
  response.send('Success');
})

app.post('/signin', (request, response) => { signin.handleSignin(request, response, db, bcrypt)})

app.post('/register', (request, response) => { register.handleRegister(request, response, db, bcrypt) })

app.get('/profile/:id', (request, response) => { profile.handleProfileGet(request, response, db) })

app.put('/image', (request, response) => { image.handleImage(request, response, db) })

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
})
