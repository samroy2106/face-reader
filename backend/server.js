const express = require('express');
const bodyParser = require('body-parser');
const bcryt = require('bcrypt-nodejs');
const cors = require('cors');

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
  response.send(database.users);
})

app.post('/signin', (request, response) => {
  if(request.body.email === database.users[0].email && request.body.password === database.users[0].password) {
    response.json(database.users[0]);
  } else {
    response.status(400).json('error logging in');
  }
})

app.post('/register', (request, response) => {
  const { email, name, password } = request.body;
  database.users.push({
    id: '125',
    name: name,
    email: email,
    entries: 0,
    joined: new Date()
  })

  response.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (request, response) => {
  const { id } = request.params;
  let found = false;
  database.users.forEach(user => {
    if(user.id === id) {
      found = true;
      return response.json(user);
    }
  })
  if(!found) {
    response.status(400).json('not found');
  }
})

app.put('/image', (request, response) => {
  const { id } = request.body;
  let found = false;
  database.users.forEach(user => {
    if(user.id === id) {
      found = true;
      user.entries++;
      return response.json(user.entries);
    }
  })
  if(!found) {
    response.status(400).json('not found');
  }
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
