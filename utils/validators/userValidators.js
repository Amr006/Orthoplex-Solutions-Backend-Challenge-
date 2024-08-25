const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.updateValidator = [
  check('name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Too short User name'),


  check('email')
    .optional() 
    .isEmail()
    .withMessage('Invalid email address'),

  validatorMiddleware,
];

