const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Contacts = require('./Contacts');

const SpamAction = sequelize.define('spamaction', {

    isMarkedAsSpam: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

// Association between User and SpamAction
User.hasMany(SpamAction);
SpamAction.belongsTo(User);

// Association between Contacts and SpamAction
Contacts.hasMany(SpamAction);
SpamAction.belongsTo(Contacts);

module.exports = SpamAction;
