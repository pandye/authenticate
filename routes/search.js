var express = require('express');
var router = express.Router();
const User = require('../models/User');
const UserContact = require('../models/UserContact');
const Contacts = require('../models/Contacts');
const { Op } = require('sequelize');

// Search for a person by name
router.get('/search/name', async (req, res) => {
    try {

        const { query } = req.query;

        const results = await Contacts.findAll({
            where: {
                // Search for names starting with the query
                [Op.or]: [
                    { name: { [Op.startsWith]: query } },
                    // Search for names containing the query but not starting with it
                    { name: { [Op.substring]: query }, name: { [Op.notLike]: `${query}%` } }
                ]
            },
            attributes: ['name', 'phoneNumber', 'spamLikelihood']
        });

        // Sorting logic
        results.sort((a, b) => {

            const aStartsWith = a.name.startsWith(query);
            const bStartsWith = b.name.startsWith(query);

            if (aStartsWith && !bStartsWith) {
                return -1;
            }

            if (!aStartsWith && bStartsWith) {
                return 1;
            }

            return 0;
        });

        res.json(results);
    }
    catch (error) {

        console.error('Error searching for person by name:', error);
        res.status(500).json({ error: 'Unable to perform search' });
    }
});

// Search for a person by phone number
router.get('/search/number', async (req, res) => {
    try {

        const { query } = req.query;

        // Check if there is a registered user with the phone number
        const registeredUser = await User.findOne({ where: { phoneNumber: query } });

        if (registeredUser) {

            // If a registered user is found, check if the searching user is in the contact list
            const isContact = await UserContact.findOne({ 
                where: { phoneNumber: query, userId: registeredUser.id }
            });

            if (isContact) {

                // If the searching user is in the contact list, include the email
                return res.json([{ name: registeredUser.name, phoneNumber: query, email: registeredUser.email }]);
            }
            else {

                // If the searching user is not in the contact list, exclude the email
                return res.json([{ name: registeredUser.name, phoneNumber: query }]);
            }
        }
        else {

            // If no registered user found, search for non-registered users
            const results = await Contacts.findAll({
                where: { phoneNumber: query },
                attributes: ['name', 'phoneNumber', 'spamLikelihood']
            });

            res.json(results);
        }
    }
    catch (error) {

        console.error('Error searching for person by name:', error);
        res.status(500).json({ error: 'Unable to perform search' });
    }
});

module.exports = router;
