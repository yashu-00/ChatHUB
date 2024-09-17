const sequelize = require('./db');
const { DataTypes, Model } = require('sequelize');

class Friends extends Model { }

Friends.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey : true,
            references: {
                model: 'users', // Reference to the users table
                key: 'id'
            }
        },
        friend_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey : true,
            references: {
                model: 'users', // Reference to the users table (friends are also users)
                key: 'id'
            }
        },
    },
    {
        sequelize,
        modelName: 'Friends',
        tableName: 'friends',
        timestamps: false,
        primaryKey: false,
    },
);

// Export the model without defining associations here
module.exports = Friends;
