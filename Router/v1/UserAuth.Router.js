const {
	createUserCollaction,
	loginUserCollaction,
	getUser,
} = require('../../Collaction/UserAuth.Collaction');
const { verifyToken } = require('../../Meddilware/verifyToken');

const Router = require('express').Router();

Router.post('/register', createUserCollaction);
Router.post('/login', loginUserCollaction);
Router.get('/current_user', verifyToken, getUser);

module.exports = Router;
