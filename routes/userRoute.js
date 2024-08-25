const express = require('express');
const {
    updateValidator,
  loginValidator,
} = require('../utils/validators/userValidators');

const {
  update,
  findAll,
  findOne,
  deleteOne,
  listInactiveUsers,
  topThreeUsersByLoginFrequency
} = require('../services/userServices');

const { protect , allowedTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/',protect, findAll);
router.get('/topThree', topThreeUsersByLoginFrequency)
router.get('/inActive', listInactiveUsers)
router.get('/:id', findOne);
router.put('/:id', updateValidator, update);
router.delete('/:id', allowedTo('admin'), deleteOne)

module.exports = router;