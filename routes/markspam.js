var express = require('express');
var router = express.Router();
const Contacts = require('../models/Contacts');
const SpamAction = require('../models/SpamAction');

// Mark number as spam
router.post('/mark-spam', async (req, res) => {
    try {

        const body = Object.assign({}, req.body);

        const { phoneNumber } = body;

        if (!phoneNumber) {
            return res.status(400).json({ error: 'phoneNumber is required' });
        }

        // Create Contacts instance if it does not exist
        let  [ contactInstance ]  = await Contacts.findOrCreate({ where: { phoneNumber }});

        let [ spamAction ] = await SpamAction.findOrCreate({
            where: { userId: req.userId, contactId: contactInstance.id }
        });
        
        if (!spamAction.isMarkedAsSpam) {

            // Mark the action as performed by the user
            spamAction.isMarkedAsSpam = true;
            await spamAction.save();
        }

        // Update the spamLikelihood
        contactInstance.spamLikelihood += 1;
        await contactInstance.save();

        res.send({ message: "phone number is marked as spam!" });
    }
    catch (error) {

        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
