const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contacts = sequelize.define('contacts', {

    name: {
        type: DataTypes.STRING,
        defaultValue: 'Spam'
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    spamLikelihood: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = Contacts;
