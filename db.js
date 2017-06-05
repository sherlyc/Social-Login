
module.exports = {
  findById,
  findByEmail,
  findByFaceBookID,
  addUser,
  createUser
}

function findById (id, connection) {
  return connection("users").where('id' , id).first()
}

function findByEmail (email, connection) {
  return connection('users').where('email', email).first()
}

function findByFaceBookID(facebookId, connection) {
  return connection('users').where('facebookId', facebookId).first()
}

function addUser(data, connection) {
  return connection('users').insert(data)
}

function createUser(data, connection) {
  return findByEmail(data.email, connection)
    .then (function(result){
       if (result.email == data.email) {
         return 'err'
       } else {
         return addUser(data, connection)
       }
    })
}
