const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User')

const UserContact = sequelize.define('usercontact', {
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	phoneNumber: {
		type: DataTypes.STRING,
		allowNull: false
	}
});

// Association between User and UserContact
User.hasMany(UserContact);
UserContact.belongsTo(User);

module.exports = UserContact;
