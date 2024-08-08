class ApiError extends Error {
	constructor(statusCode, error = 'Something Went Wrong...', stack = '') {
		super(error);
		this.statusCode = statusCode;
		this.data = null;
		this.error = error;
		this.success = false;

		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

module.exports = ApiError;
