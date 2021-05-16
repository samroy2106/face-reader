const handleSignin = (request, response, db, bcrypt) => {
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
}

module.exports = {
  handleSignin: handleSignin
}
