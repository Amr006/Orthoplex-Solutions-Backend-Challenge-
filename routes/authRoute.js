const express = require('express');
const {
  signupValidator,
  loginValidator,
} = require('../utils/validators/authValidators');

const {
  register,
  login,
  verifyOtp,
} = require('../services/authServices');
const { default: rateLimit } = require('express-rate-limit');

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: 'Too many attempts',
  standardHeaders: true, 
  legacyHeaders: false, 
});



router.post('/register', signupValidator, limiter ,register);
router.post('/login', loginValidator, limiter, login);
router.post('/verifyOtp', limiter, verifyOtp);

module.exports = router;