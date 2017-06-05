var bcryptjs = require('bcryptjs')

module.exports = {
  hashPassword,
  comparePassword
}

function hashPassword (pwd) {
  var salt = bcryptjs.genSaltSync(10);
  var hash = bcryptjs.hashSync(pwd, salt);
  return hash
}


function comparePassword (pwd, hash) {
  return bcryptjs.compare(pwd, hash)
}
