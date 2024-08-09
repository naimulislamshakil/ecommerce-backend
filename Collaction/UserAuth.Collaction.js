const UserModel = require('../Schema/UserAuth.Schema');
const ApiError = require('../Utils/ApiError');
const ApiResponse = require('../Utils/ApiResponce');
const asyncHandler = require('../Utils/asyncHendeler');
const bcrypt = require('bcrypt');

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

	const createdUser = await UserModel.findById({ _id: user._id }).select(
		'-password -refreshToken'
	);

	if (!createdUser) {
		throw new ApiError(500, 'Something went wrong....');
	}

	return res
		.status(201)
		.json(new ApiResponse(200, createdUser, 'User registered Successfully...'));
});

// generate token
const generateAccessAndRefreshToken = async (userId) => {
	try {
		const user = await UserModel.findById({ _id: userId });

		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();

		user.refreshToken = refreshToken;
		user.save({ validateBeforeSave: false });

		return { accessToken, refreshToken };
	} catch (error) {
		throw new ApiError(500, 'Something went wrong!!!');
	}
};

exports.loginUserCollaction = asyncHandler(async (req, res, next) => {
	// check realy get data from backend
	// chack all fields are not empty
	// find user by email ==> if false create a error
	// check and compare password
	// create accessToken and refreshtoken
	// set accessToken and refreshToken by cookies
	// response with message, successs, and {data, accessToken, refreshToken}

	const { email, password } = req.body;

	if ([email, password].some((field) => field.trim() === '')) {
		throw new ApiError(400, 'All fields are required');
	}

	const user = await UserModel.findOne({ email });

	if (!user) {
		throw new ApiError(409, 'You are not Registered. Please Register...');
	}

	const comparePassword = bcrypt.compareSync(password, user?.password);

	if (!comparePassword) {
		throw new ApiError(401, 'The provided email or password is incorrect');
	}

	const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
		user?._id
	);

	const loggedInUser = await UserModel.findById(user._id).select(
		'-password -refreshToken'
	);

	const options = {
		httpOnly: true,
		secure: true,
	};

	return res
		.status(200)
		.cookie('accessToken', accessToken, options)
		.cookie('refreshToken', refreshToken, options)
		.json(
			new ApiResponse(
				200,
				{
					user: loggedInUser,
					accessToken,
					refreshToken,
				},
				'User logged In Successfully'
			)
		);
});
