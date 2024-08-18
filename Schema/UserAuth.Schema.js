const schema = require('mongoose').Schema;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new schema(
	{
		name: String,
		email: String,
		password: String,
		refreshToken: String,
		roll: {
			type: String,
			enum: ['user', 'vendor', 'admin'],
			default: 'user',
		},
		address: {
			address_line1: String,
			address_line2: String,
			city: String,
			state: String,
			ZipCode: String,
			country: String,
		},
		delivery_address: {
			address_line1: String,
			address_line2: String,
			city: String,
			state: String,
			ZipCode: String,
			country: String,
		},
		dob: Date,
		gender: String,
		primary_number: String,
		secendary_number: String,
		profile_img: String,
	},
	{ timestamps: true }
);

// Hash password

userSchema.pre('save', function (next) {
	if (!this.isModified('password')) return next();

	const pass = this.password;
	const hashPassword = bcrypt.hashSync(pass, 10);
	this.password = hashPassword;
	next();
});



const UserModel = mongoose.model('USER', userSchema);

module.exports = UserModel;
