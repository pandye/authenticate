const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('authenticate', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
});

// Test the connection
async function testConnection() {
	try {

		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
	}
	catch (error) {
		console.error('Unable to connect to the database:', error);
	}
}

module.exports = sequelize;