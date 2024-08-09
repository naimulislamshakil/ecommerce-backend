const {
	createUserCollaction,
} = require('../../Collaction/UserAuth.Collaction');

const Router = require('express').Router();

Router.post('/register', createUserCollaction);

module.exports = Router;
