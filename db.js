
module.exports = {
  findById,
  findByEmail,
  findByFaceBookID,
  addUser
}

function findById (id, connection) {
  return connection("users").where('id' , id)
}

function findByEmail (email, connection) {
  return connection('users').where('email', email)
}

function findByFaceBookID(facebookId, connection) {
  return connection('users').where('facebookId', facebookId)
}

function addUser(data, connection) {
  return connection('users').insert(data)
}
