const sequelize = require('./db');
const { DataTypes, Model } = require('sequelize');
class FriendRequest extends Model { }

FriendRequest.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'users', // Reference to the users table
                key: 'id'
            }
        },
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'users', // Reference to the users table (senders are also users)
                key: 'id'
            }
        },
    },
    {
        sequelize,
        modelName: 'FriendRequest',
        tableName: 'request',
        timestamps: false,
        primaryKey: false,
    },
);

// Export the model without defining associations here
module.exports = FriendRequest;
