const handleImage = (request, response, db) => {
  const { id } = request.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    response.json(entries[0]);
  })
  .catch(err => response.status(400).json("Unable to get entries"))
}

module.exports = {
  handleImage: handleImage
}
