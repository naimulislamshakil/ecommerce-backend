const UserModel = require('../Schema/UserAuth.Schema');
const ApiError = require('../Utils/ApiError');
const ApiResponse = require('../Utils/ApiResponce');
const asyncHandler = require('../Utils/asyncHendeler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
	generateAccessToken,
	generateRefreshToken,
} = require('../Utils/GenerateAccess&refresh');

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
		const user = await UserModel.findById(userId);

		const accessToken = generateAccessToken(user?._id, user?.email);
		const refreshToken = generateRefreshToken(user?._id);

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

exports.getUser = asyncHandler(async (req, res) => {
	const { id, email } = req.user;

	const user = await UserModel.findById({ _id: id }).select(
		'-password -refreshToken'
	);

	return res
		.status(200)
		.json(new ApiResponse(200, { user }, 'User fetched successfully'));
});

exports.refreshAccessToken = asyncHandler(async (req, res) => {
	const incommingToken = req.cookies?.refreshToken;

	if (!incommingToken) {
		throw new ApiError(401, 'Unauthorized Access!!');
	}

	try {
		const decoded = await jwt.verify(
			incommingToken,
			process.env.REFRESH_TOKENSECRET_KEY
		);

		const user = await UserModel.findById(decoded.id);

		if (!user) {
			throw new ApiError(401, 'Invalid Access!!');
		}

		if (incommingToken !== user?.refreshToken) {
			throw new ApiError(401, 'Unauthorized Access!!');
		}

		const userForClient = await UserModel.findById(user?._id).select(
			'-password -refreshToken'
		);

		const option = {
			httpOnly: true,
			secure: true,
		};

		const { accessToken, refreshToken: newRefreshToken } =
			await generateAccessAndRefreshToken(user?._id);

		return res
			.status(200)
			.cookie('accessToken', accessToken, option)
			.cookie('refreshToken', newRefreshToken, option)
			.json(
				new ApiResponse(
					200,
					{ userForClient, accessToken, refreshToken: newRefreshToken },
					'Valid User!!'
				)
			);
	} catch (error) {
		console.log({ error });
		throw new ApiError(401, 'Invalid Access!!');
	}
});
