const express = require('express');
const router = express.Router();
const friendMethods = require('../controllers/friendController')

router.get('/profile/:username',friendMethods.showFriendProfile);
router.post('/remove-friend/:friendId',friendMethods.removeFriend);
router.post('/pay',friendMethods.sendingMoney);
router.get('/payment-success',friendMethods.uploadTransactionInDatabase);
router.put('/msg',friendMethods.deleteMsg)
router.put('/msg/delete',friendMethods.unsendMsg)


module.exports = router;
