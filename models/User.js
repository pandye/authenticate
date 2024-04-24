const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('user', {
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	phoneNumber: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	email: {
		type: DataTypes.STRING,
		allowNull: true
	},
	password: {
		type: DataTypes.STRING,
		allowNull: true
	}
});

module.exports = User ;
