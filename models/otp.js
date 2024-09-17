const sequelize = require('./db');
const { DataTypes, Model } = require('sequelize');
class OTP extends Model { }

OTP.init(
    {
        otp: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER(120),
            allowNull: false,
        },
    }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'OTP', // We need to choose the model name,
    tableName: 'otps',
    timestamps:false
},
);

module.exports = OTP;
