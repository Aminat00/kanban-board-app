const mongoose = require("mongoose")

const tokenSchema = new mongoose.Schema({
	accessToken: {
		type: String,
		required: true,
	},
	refreshToken: {
		type: String,
		required: true,
	},
	expirationDate: {
		type: Date,
		required: true,
	},
})

const Token = mongoose.model("Token", tokenSchema)
