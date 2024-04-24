const hoaxer = require('hoaxer');
const User = require('./models/User');
const Contacts = require('./models/Contacts');
const sequelize = require('./config/database');


async function populateDatabase() {
	try {

		// Populate Users
		const users = [];

		for (let i = 0; i < 50; i++) {
			users.push({
				name: hoaxer.name.findName(),
				email: hoaxer.internet.email(),
				phoneNumber: hoaxer.phone.phoneNumber()
			});
		}

		await User.bulkCreate(users);

		// Populate contacts
		const contacts = [];

		for (let i = 0; i < 100; i++) {
			contacts.push({
				name: hoaxer.name.findName(),
				phoneNumber: hoaxer.phone.phoneNumber(),
				spamLikelihood: Math.floor(Math.random() * 101)
			});
		}

		await Contacts.bulkCreate(contacts);

		console.log('Database populated successfully');
	}
	catch (error) {

		console.error('Error populating database:', error);
	}
	finally {

		// Close the database connection
		await sequelize.close();
	}
}

populateDatabase();
