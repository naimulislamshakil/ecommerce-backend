const UserModel = require('../Schema/UserAuth.Schema');
const ApiError = require('../Utils/ApiError');
const ApiResponse = require('../Utils/ApiResponce');
const asyncHandler = require('../Utils/asyncHendeler');

exports.createUserCollaction = asyncHandler(async (req, res) => {
	// What is the main step for craete a user:
	// 1. Get all data from frontend.
	// 2. Check field not empty.
	// 3. Check user is exist or not exist. If exist Then, send a api responce "user already register". Or user not exist then carete a user.

	const { name, email, password } = req.body;

	if ([name, email, password].some((field) => field.trim() === '')) {
		throw new ApiError(400, 'All fields are required');
	}

	const isUserExist = await UserModel.findOne({ email });

	if (isUserExist) {
		throw new ApiError(409, 'User Already Exist. Please Login..');
	}

	const user = await UserModel.create({ email, name, password });

	const createdUser = await UserModel.findById({ _id: user._id });

	if (!createdUser) {
		throw new ApiError(500, 'Something went wrong....');
	}

	return res
		.status(201)
		.json(new ApiResponse(200, createdUser, 'User registered Successfully...'));
});
