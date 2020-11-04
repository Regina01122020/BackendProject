var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	
	unique_id: {
		type: Number,
		required: true
	},

	email: {
		type: String,
		required: true
	},

	username: {
		type: String,
		required: true
	},

	password: {
		type: String,
		required: true
	},

	passwordConfirm: {
		type: String,
		required: true
	}
}),

User = mongoose.model('User', userSchema);
module.exports = User;
