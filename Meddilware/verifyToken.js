const asyncHandler = require('../Utils/asyncHendeler');
const jwt = require('jsonwebtoken');

exports.verifyToken = asyncHandler(async (req, res, next) => {
	try {
		const token = req.cookies?.accessToken;

		if (!token) {
			throw new ApiError(401, 'Unauthorize Access!!');
		}

		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

		req.user = decoded;
		next();
	} catch (error) {
		throw new ApiError(401, error?.message || 'Unauthorize Access!!');
	}
});
