const express = require("express")
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchUser = require('../middleware/fetchuser')
const SEC_TEXT = 'Rahul$123@45'

router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})

// Creating/registration user with required details
router.post("/createuser",
  // User validation condition
  [
    body('name', 'Enter valid name').notEmpty(),
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Enter valid password').isLength({ min: 5 })
  ],
  async (req, res, next) => {
    try {
      const error = validationResult(req)
      if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() })
      }
      let user = await User.findOne({ email: req.body.email })
      if (user) {
        return res.status(400).json({
          errors: 'sorry a User with this email already exist'
        })
      }
      // saving user to mongoose data base.
      const salt = await bcrypt.genSaltSync(10);
      const hasPassword = await bcrypt.hashSync(req.body.password, salt);
      user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hasPassword
      })
      user=user.save()
        .then(() => {
          let jwtPayLoad = {
            user: {
              id: req.body.id
            }
          }

          let authToken = jwt.sign(jwtPayLoad, SEC_TEXT)
          return res.status(200).json({ authToken: authToken });
        })
        .catch(error => {
          res.status(400).json({ errors: "some error occurred" })
        })
    }
    catch (error) {
      return res.status(400).json({ errors: 'Some internal error occurred' })
    }
  })

// User login or checking weather user does exist or note/
router.post('/login', [
  body('email', 'Enter valid name').isEmail(),
  body('password', 'Password should be min 5 char').isLength({ min: 5 })
], async (req, res) => {
  try {
    const { email, password } = req.body;
    const payloadError = await validationResult(req);
    if (!payloadError.isEmpty()) {
      return res.status(400).json({ errors: payloadError.array() });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: 'please try to login with correct credential' });
    }
    const matchedPwd = bcrypt.compare(user.password, password);
    if (!matchedPwd) {
      return res.status(400).json({ errors: 'please try to login with correct credential' })
    }
    let jwtPayLoad = {
      user: {
        id: user.id
      }
    }

    const authToken = jwt.sign(jwtPayLoad, SEC_TEXT);
    res.json({ authToken: authToken })
  }
  catch (error) {
    console.log(error.message);
    return res.status(500).json({ errors: 'Internal Error occurred' })
  }
})


router.post('/getuser', fetchUser, async (req, res) => {
  const id = req.user.id;
  try {
    const user = await User.findById(id).select("-password");
    res.send(user);

  } catch (error) {
    res.status(401).send({ error: 'Please authenticate using the valid token' })
  }
})

module.exports = router