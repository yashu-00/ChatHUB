const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./db'); // Assuming you have a separate db.js file for Sequelize initialization

class Payment extends Model { }

Payment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        toUser: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fromUser: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        paymentDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW, // Automatically set the current date and time
        },
        stripeSessionId: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize, // Pass the sequelize instance
        modelName: 'Payment', // Name of the model
        tableName: 'payments', // Table name in the database
        timestamps: false, // Disable createdAt and updatedAt fields
    },
);

// Export the model
module.exports = Payment;
