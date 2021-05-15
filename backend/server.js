const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'mercuryapple123',
    database: 'face-reader'
  }
});

db.select('*').from('users').then(data => {
  console.log(data);
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'john@gmail.com'
    }
  ]
}

app.get('/', (request, response) => {
  response.send('Success');
})

app.post('/signin', (request, response) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', request.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(request.body.password, data[0].hash);
      if(isValid) {
        return db.select('*').from('users')
          .where('email', '=', request.body.email)
          .then(user => {
            response.json(user[0])
          })
          .catch(err => response.status(400).json('Unable to get user'))
      } else {
        response.status(400).json('Wrong credentials')

      }
    })
    .catch(err => response.status(400).json('Wrong credentials'))
})

app.post('/register', (request, response) => {
  const { email, name, password } = request.body;
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            response.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => response.status(400).json('Unable to register'))
})

app.get('/profile/:id', (request, response) => {
  const { id } = request.params;
  db.select('*').from('users').where({id})
    .then(user => {
      if(user.length){
        response.json(user[0]);
      } else {
        response.status(400).json('Not found')
      }
  })
  .catch(err => response.status(400).json('Error getting user'))
})

app.put('/image', (request, response) => {
  const { id } = request.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    response.json(entries[0]);
  })
  .catch(err => response.status(400).json("Unable to get entries"))
})

/*
bcrypt.hash("bacon", null, null, function(err, hash) {
  //res == true
});

bcrypt.compare("bacon", hash, function(err, res) {
  //res == true
});

bcrypt.compare("veggies", hash, function(err, res) {
  //res == true
});
*/
app.listen(3000, () => {
  console.log('app is running on port 3000');
})
