const {
	createUserCollaction,
	loginUserCollaction,
	getUser,
	refreshAccessToken,
} = require('../../Collaction/UserAuth.Collaction');
const { verifyToken } = require('../../Meddilware/verifyToken');

const Router = require('express').Router();

Router.post('/register', createUserCollaction);
Router.post('/login', loginUserCollaction);
Router.get('/current_user', verifyToken, getUser);
Router.post('/refresh_token', refreshAccessToken);
Router.post('/logout', refreshAccessToken);

module.exports = Router;
