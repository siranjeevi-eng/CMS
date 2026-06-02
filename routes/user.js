
const express = require('express')
const {registerUser,loginUser} = require('../controllers/users')
const jwt = require('jsonwebtoken')
const {authMiddleware} = require('../middleware')

const router = express.Router()
router.post('/signup', registerUser)

router.post('/login', loginUser)

router.get('/protected', authMiddleware, (req,res)=>{
    res.json({message: 'Protected route', user: req.user})
  });

module.exports = router;