const handleProfileGet = (request, response, db) => {
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
}

module.exports = {
  handleProfileGet: handleProfileGet
}
