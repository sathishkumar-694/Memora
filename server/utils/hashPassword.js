const bcrypt = require("bcrypt")
const hashPassword = async (pass) => {
  const hashed = await bcrypt.hash(pass, 10);
  return hashed;
};
module.exports = hashPassword