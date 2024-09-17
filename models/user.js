const sequelize = require('./db');
const { DataTypes, Model } = require('sequelize');

class User extends Model { }

User.init(
    {
        name: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        user_name: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        number: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
);

// Export the model without defining associations here
module.exports = User;
