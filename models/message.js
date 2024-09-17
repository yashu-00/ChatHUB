const sequelize = require('./db');
const { DataTypes, Model } = require('sequelize');
class Message extends Model { }

Message.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    sender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    recipient: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    user_delete: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null, // Set default to null
    },

}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Message', // We need to choose the model name,
    tableName: 'messages',
    timestamps: false,
    primaryKey: false,
},);

module.exports = { Message };
