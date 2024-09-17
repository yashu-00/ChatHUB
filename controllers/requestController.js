const { User, Friends , FriendRequest} = require('../models');
const sequelize = require('../models/db.js')
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');

const requestMethods = {
    showRequest : async (req, res) => {
        const currentUser = req.user; 
        try {
            const requests = await FriendRequest.findAll({
                where: { user_id: currentUser.id },
                include: [{
                    model: User,
                    as: 'senderUser',  // Use the correct alias here
                    attributes: ['user_name'],
                    where: { id: Sequelize.col('FriendRequest.sender_id') }  // Match the sender_id
                }],
                raw: true
            });
            console.log(requests)
            res.render('user/request', { requests });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    },

    acceptRequest :  async (req, res) => {
        const { requestId } = req.body;
        const currentUser = req.user;
    
        try {
            const request = await FriendRequest.findOne({
                where: { sender_id: requestId, user_id: currentUser.id },
            });
    
            if (!request) {
                return res.status(404).send('Friend request not found');
            }
    
            let friend1 = new Friends()
            friend1.user_id = currentUser.id
            friend1.friend_id = request.sender_id
            await friend1.save()
    
            let friend2 = new Friends()
            friend2.user_id = request.sender_id
            friend2.friend_id = currentUser.id
            await friend2.save()
    
            await FriendRequest.destroy({ where: { sender_id: requestId, user_id: currentUser.id } });
            res.send('Friend request accepted');
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    },

    rejectRequest : async (req, res) => {
        const { requestId } = req.body;
        const currentUser = req.user;
    
        try {
            const request = await FriendRequest.findOne({
                where: { sender_id: requestId, user_id: currentUser.id },
            });
    
            if (!request) {
                return res.status(404).send('Friend request not found');
            }
    
            await FriendRequest.destroy({ where: { sender_id: requestId } });
            res.send('Friend request rejected');
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    }
}

module.exports = requestMethods