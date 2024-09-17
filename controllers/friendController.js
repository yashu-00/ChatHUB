const { User, Friends } = require('../models');
const { Message } = require('../models/message')
const stripe = require('stripe')('sk_test_51PtCbeRvoIV0bFzsBPsuAjMZXOC4PfhEeJmgbWUlv7gikQfDVEdtF9xPq8Nek7SeR4TL3o6Q9X3XXLqEl1IqPViz00afKNIJJl')
const Payment = require('../models/payment');
const { showFriends } = require('./userController');

const friendMethods = {

    showFriendProfile: async (req, res) => {
        try {
            const { username } = req.params;
            const currentUser = req.user;
            const friend = await User.findOne({ where: { user_name: username } });

            if (!friend) {
                return res.status(404).send('Friend not found');
            }

            const areFriends = await Friends.findOne({
                where: {
                    user_id: currentUser.id,
                    friend_id: friend.id
                }
            });

            if (!areFriends) {
                return res.status(403).send('You are not friends with this user');
            }

            res.render('user/friendProfile', {
                friendFullName: friend.name,
                friendUserName: friend.user_name,
                friendId: friend.id,
                friendImage: friend.image
            });
        } catch (error) {
            console.error('Error fetching friend details:', error);
            res.status(500).send('Server error');
        }
    },

    removeFriend: async (req, res) => {
        try {
            const { friendId } = req.params;
            const currentUser = req.user; // Assuming req.user contains the logged-in user's details

            const friend = await User.findOne({
                where: {
                    id: friendId
                }
            })
            await Friends.destroy({
                where: {
                    user_id: currentUser.id,
                    friend_id: friendId
                }
            });

            await Friends.destroy({
                where: {
                    user_id: friendId,
                    friend_id: currentUser.id
                }
            });
            await Message.destroy({
                where: {
                    sender: currentUser.user_name,
                    recipient: friend.user_name
                }
            });
            await Message.destroy({
                where: {
                    recipient: currentUser.user_name,
                    sender: friend.user_name
                }
            });
            // Redirect to the user's profile or some other page
            res.redirect('/users/friends');
        } catch (error) {
            console.error('Error removing friend:', error);
            res.status(500).send('Server error');
        }
    },

    sendingMoney: async (req, res) => {
        try {
            const { amount, to, from } = req.body;
            const amountInCents = Math.round(amount * 100);

            const lineItems = [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: "Total Payment", // Replace with dynamic data if needed
                    },
                    unit_amount: amountInCents, // Amount in cents
                },
                quantity: 1,
            }];

            const referer = req.headers.referer;
            const protocol = req.headers['x-forwarded-proto'] || req.protocol;  // Get protocol dynamically
            const host = req.headers.host;  // Get the host dynamically

            // Build the baseUrl to support IP address and hostname usage
            const baseUrl = `${protocol}://${host}`;

            const successReferer = `${baseUrl}/friends/payment-success?session_id={CHECKOUT_SESSION_ID}`;
            const cancelReferer = referer || `${baseUrl}/friends/payment-cancel`; // Fallback if no referer

            // Create the Stripe session with metadata
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                shipping_address_collection: {
                    allowed_countries: ['US', 'BR'], // Specify allowed countries
                },
                success_url: successReferer, // Redirect with session_id
                cancel_url: cancelReferer, // Redirect to the previous page on cancel
                metadata: {
                    toUser: to,
                    fromUser: from
                }
            });

            res.json({ url: session.url });  // Send the Stripe checkout page URL
        } catch (error) {
            console.error('Error creating Stripe checkout session:', error);
            res.status(500).json({ error: 'Something went wrong. Please try again later.' });
        }
    },

    uploadTransactionInDatabase: async (req, res) => {
        const sessionId = req.query.session_id;

        try {
            // Retrieve the session details from Stripe to verify payment
            const session = await stripe.checkout.sessions.retrieve(sessionId);

            if (session.payment_status === 'paid') {
                // Save payment to database if not already saved
                const existingPayment = await Payment.findOne({ where: { stripeSessionId: sessionId } });

                if (!existingPayment) {
                    await Payment.create({
                        amount: session.amount_total / 100,  // Store the amount in dollars
                        toUser: session.metadata.toUser,    // Retrieve toUser from session metadata
                        fromUser: session.metadata.fromUser,// Retrieve fromUser from session metadata
                        paymentDate: new Date(),            // Current date and time
                        stripeSessionId: sessionId          // Stripe session ID for reference
                    });
                }

                let friend = await User.findOne({
                    where: {
                        user_name: session.metadata.toUser
                    }
                });

                // Redirect to a confirmation page or display a success message
                res.redirect('/users/chat/' + friend.id + '?username=' + session.metadata.toUser); // Replace with your success page
            } else {
                // Handle cases where the payment was not successful
                res.status(400).json({ error: 'Payment not completed.' });
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
            res.status(500).json({ error: 'Something went wrong. Please try again later.' });
        }
    },

    deleteMsg: async (req, res) => {
        try {
            const id = req.body.messageId;
            const result = await Message.findOne({
                where: { id: id }
            });
            if (result.user_delete != null) {
                // If already marked for deletion by the user, fully delete the message
                await Message.destroy({
                    where: { id: id }
                });
            } else {
                // Mark the message as deleted by the current user
                await Message.update(
                    { user_delete: req.user.user_name }, // Use `req.user.userName` if you have the current user stored in `req`
                    { where: { id: id } }
                );
            }
            res.status(200).json({ success: true, message: 'Message deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Failed to delete message' });
        }
    },

    unsendMsg: async (req, res) => {
        try {
            const id = req.body.messageId;
            console.log(id)
            await Message.destroy({
                where: { id: id }
            });
            res.status(200).json({ success: true, message: 'Message unsent successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Failed to unsend message' });
        }
    }

}

module.exports = friendMethods