const ApiError = require('./ApiError');

const errorHandler = (err, req, res, next) => {
	if (err instanceof ApiError) {
		return res.status(err.statusCode).json({
			...err,
		});
	}
	return res.status(500).send(err.message);
};

module.exports = errorHandler;
