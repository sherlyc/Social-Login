
module.exports = {
  findById
}

function findById (id, connection) {
  return connection("users").where('id' , id)
}
