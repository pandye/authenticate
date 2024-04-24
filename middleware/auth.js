const jwt = require('jsonwebtoken');
const config = require('../config/config.json') 

function authMiddleware(req, res, next) {

	const token = req.headers.authorization;

	if (!token) {
		return res.status(401).json({ error: 'Authorization token not provided' });
	}

	try {

		const decodedToken = jwt.verify(token, config.secret_key);
		req.userId = decodedToken.userId;
		next();
	}
	catch (error) {

		console.error('Error verifying token:', error);
		res.status(401).json({ error: 'Invalid token' });
	}
}

module.exports = authMiddleware;
