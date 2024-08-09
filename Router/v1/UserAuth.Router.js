const {
	createUserCollaction,
	loginUserCollaction,
} = require('../../Collaction/UserAuth.Collaction');

const Router = require('express').Router();

Router.post('/register', createUserCollaction);
Router.post('/login', loginUserCollaction);

module.exports = Router;
