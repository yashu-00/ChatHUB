const express = require('express');
const router = express.Router();
const requestMethods = require('../controllers/requestController')

router.get('/requests',requestMethods.showRequest);
router.post('/api/friend-request/accept',requestMethods.acceptRequest);
router.post('/api/friend-request/reject',requestMethods.rejectRequest);

module.exports = router;
