const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const cookiePerser = require('cookie-parser');
const errorHandler = require('./Utils/errorHandler');
const port = process.env.PORT || 5000;
require('dotenv').config();

// import route
const userRoute = require('./Router/v1/UserAuth.Router');

app.use(bodyParser.json());
app.use(express.json());
app.use(
	cors({
		origin: ['http://localhost:3000'],
		credentials: true,
	})
);
// app.use(express.urlencoded({ extended: false }));
app.use(cookiePerser());

mongoose
	.connect('mongodb://0.0.0.0:27017', {})
	.then(() => console.log('Database connected successfully.'))
	.catch((err) => console.log(err));

app.get('/', (req, res) => {
	res.send('<h1>How are you?</h1>');
});

// call all route
app.use('/api/v1/user', userRoute);

app.use('*', (req, res, next) => {
	const { baseUrl } = req;

	res.send(`<h1>${baseUrl} Not Found!</h1>`);
	next(`${baseUrl} Not Found!`);
});

app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server is running port: ${port}`);
});
