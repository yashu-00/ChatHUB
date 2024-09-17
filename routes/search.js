const express = require('express');
const router = express.Router();
const searchModels = require('../controllers/searchController')

router.get('/search',searchModels.showSearchPage)
router.get('/api/search',searchModels.showSearchResult);
router.post('/api/friend-request',searchModels.sendFriendRequest);

module.exports = router