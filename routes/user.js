const express = require('express');
const router = express.Router();
const userMethod = require('../controllers/userController');
const validation = require('../middlewares/uservalidation');
const multer = require('multer')

const path = require('path');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads'),
    filename: (req, file, cb) => {
        const date = new Date();
        const filename = `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}_${file.originalname}`;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });


router.get('/friends', userMethod.showFriends);
router.get('/chat/:friendId', userMethod.showChatPage);
router.get('/profile', userMethod.showProfile);
router.get('/editProfile', userMethod.showEditPage);
router.get('/transactions', userMethod.showTransactions);
router.post('/updateProfile', upload.single('image'), userMethod.updateProfile);
router.get('/add-friends', userMethod.showExistingUsers);

module.exports = router;
