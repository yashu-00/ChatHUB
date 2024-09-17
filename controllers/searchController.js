const { User, Friends, FriendRequest } = require('../models');
const sequelize = require('../models/db.js')
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');

const searchMethods = {
    showSearchPage: (req, res) => {
        res.render('user/search')
    },

    showSearchResult: async (req, res) => {
        const { username } = req.query;
        const currentUser = req.user;
        try {
            const users = await User.findAll({
                where: {
                    user_name: {
                        [Op.like]: `%${username}%`
                    },
                },
            });

            if (users.length === 0) {
                return res.json({ message: 'No users found' });
            }

            const friends = await Friends.findAll({
                where: {
                    user_id: currentUser.id,
                },
                attributes: ['friend_id'],
            });

            const friendUserIds = new Set(friends.map(friend => friend.friend_id));
            const nonFriendUsers = users.filter(user => !friendUserIds.has(user.id));
            const nonFriendUsernames = nonFriendUsers.map(user => user.user_name);
            console.log(nonFriendUsernames)
            res.json(nonFriendUsernames);
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    },

    sendFriendRequest: async (req, res) => {
        const friendUserName = req.body.friendUserName;
        const currentUser = req.user;
        console.log(friendUserName)
        try {
            const friend = await User.findOne({ where: { user_name: friendUserName } });

            if (!friend) {
                return res.status(200).send({status:404});
            }

            const existingRequest = await FriendRequest.findOne({
                where: {
                    sender_id: currentUser.id,
                    user_id: friend.id,
                },
            });

            if (existingRequest) {
                return res.status(200).send({status:400,message:"Friend request is already send"});
            }

            await FriendRequest.create({
                sender_id: currentUser.id,
                user_id: friend.id,
            });
            res.status(200).send({status:200,message : "Friend request send successfully"});
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    }

}

module.exports = searchMethods