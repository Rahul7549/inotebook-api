const jwt = require('jsonwebtoken')
const SEC_TEXT = 'Rahul$123@45'


const fetchUser = async (req, res, next) => {
    const authToken = req.header('auth-token')
    if (!authToken) {
        return res.status(401).send({ error: 'Please authenticate using the valid token' })
    }
    try {
        const data = await jwt.verify(authToken, SEC_TEXT);
        req.user = data.user;
    } catch (error) {
        console.log(error.message);
        return res.status(401).send({ error: 'Please authenticate using the valid token' })
    }
    next();
}




module.exports = fetchUser