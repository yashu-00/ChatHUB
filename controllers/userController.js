const { User, Friends, FriendRequest } = require('../models');
const sequelize = require('../models/db.js')
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');
const Path = require('path');
const Payment = require('../models/payment')


const userMethod = {
    showFriends: async (req, res) => {
        try {
            const userId = req.user.id;
            const friends = await sequelize.query(`
                SELECT \`User\`.\`id\`, \`User\`.\`user_name\` 
                FROM \`users\` AS \`User\`
                INNER JOIN \`friends\` AS \`friends\` 
                ON \`User\`.\`id\` = \`friends\`.\`friend_id\`
                AND \`friends\`.\`user_id\` = :userId
            `, {
                replacements: { userId: userId },
                type: Sequelize.QueryTypes.SELECT
            });
            res.render('user/friends', { friends });
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    },

    showChatPage: (req, res) => {
        const { username } = req.query;
        const currentUser = req.user.user_name;

        // Render the chat page with friendUserName and currentUser data
        res.render('user/chat', { friendUserName: username, currentUser });
    },

    showProfile: (req, res) => {
        res.render('user/profile', { user: req.user })
    },

    showEditPage: (req, res) => {
        res.render('user/edit', { user: req.user, message: req.flash('message') })
    },


    updateProfile: async (req, res) => {
        const data = req.body;
        console.log(data);
        try {
            const updateData = {
                name: data.name,
                user_name: data.username,
                email: data.email,
                number: data.number,
            };
            console.log(req.file.filename)
        
            // Check if an image was uploaded
            if (req.file) {
                updateData.image = req.file.filename; // Store the path of the uploaded file
            }

            // Update the user data in the database
            await User.update(updateData, {
                where: { id: req.user.id }
            });

            // Redirect to the profile page
            res.redirect('/users/profile');
        } catch (err) {
            console.log(err);
            res.render('user/edit', { user: req.user, message: "SERVER ERROR! Please try later" });
        }
    },

    showTransactions: async (req, res) => {
        try {
            // Example using raw query execution
            const query = `
            SELECT u.name, u.user_name, u.image, p.amount, p.paymentDate
            FROM users u
            JOIN payments p ON u.user_name = p.toUser
            WHERE p.fromUser = ?
            ORDER BY p.paymentDate DESC
            `;

            const results = await sequelize.query(query, {
                replacements: [req.user.user_name],
                type: sequelize.QueryTypes.SELECT
            });
            res.render('user/transaction', { transactions: results })
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    },

    showExistingUsers: async (req, res) => {
        const currentUser = req.user;
        try {
            const userss = await User.findAll({
                where: {
                    id: { [Sequelize.Op.ne]: currentUser.id }
                }
            });
            const receivedRequests = await FriendRequest.findAll({
                where: {
                    sender_id: currentUser.id
                },
                attributes: ['user_id']
            });
            const receivedRequestIds = receivedRequests.map(request => request.user_id);
            const filteredUsers = userss.filter(user =>
                !receivedRequestIds.includes(user.id)
            );
            res.render('user/add-friend', { users: filteredUsers });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    }
}

module.exports = userMethod