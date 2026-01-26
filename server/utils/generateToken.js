
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

const generateToken =(user)=>
{
    return jwt.sign({
        userId:user._id
    },
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRY
        }
    )
}
module.exports = generateToken