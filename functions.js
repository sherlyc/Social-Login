var bcrypt = require('bcryptjs')

module.exports = {
  hashPassword,
  comparePassword
}

function hashPassword (pwd) {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(pwd, salt);
  return hash
}


function comparePassword (pwd, hash) {

  bcrypt.compareSync(pwd, hash)


}
