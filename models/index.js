const User = require('./user');
const Friends = require('./friend');
const FriendRequest = require('./FriendRequest');

// Define associations after all models are imported
User.hasMany(Friends, {
    as: 'friends',
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

User.hasMany(FriendRequest, {
    as: 'receivedRequests',  // Renamed alias
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

User.hasMany(FriendRequest, {
    as: 'sentRequests',  // Renamed alias
    foreignKey: 'sender_id',
    onDelete: 'CASCADE',
});

FriendRequest.belongsTo(User, {
    as: 'senderUser',  // Unique alias
    foreignKey: 'sender_id',
    onDelete: 'CASCADE',
});

FriendRequest.belongsTo(User, {
    as: 'receiverUser',  // Renamed alias
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Friends.belongsTo(User, {
    as: 'friendUser',
    foreignKey: 'friend_id',
    onDelete: 'CASCADE',
});

Friends.belongsTo(User, {
    as: 'user',
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

module.exports = {
    User,
    Friends,
    FriendRequest,
};
