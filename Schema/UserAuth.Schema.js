const schema = require('mongoose').Schema;
const mongoose = require('mongoose');

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

const UserModel = mongoose.model('USER', userSchema);

module.exports = UserModel;
