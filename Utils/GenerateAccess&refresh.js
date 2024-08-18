const jwt = require('jsonwebtoken');

// generate Access token and also refress token using json web token as a usersheme method

exports.generateAccessToken = (id, email) => {
	return jwt.sign(
		{
			id: id,
			email: email,
		},
		process.env.ACCESS_TOKEN_SECRET_KEY,
		{ expiresIn: process.env.ACCESS_TOKEN_EXPAIR_DATE }
	);
};

exports.generateRefreshToken = (id) => {
	return jwt.sign({ id: id }, process.env.REFRESH_TOKENSECRET_KEY, {
		expiresIn: process.env.REFRESH_TOKEN_EXPAIR_DATE,
	});
};
