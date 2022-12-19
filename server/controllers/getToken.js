const Token = require("../models/token")

const getToken = async () => {
	if (tokenExpired()) {
		// find the stored token in the database
		const storedToken = await Token.findOne({})
		if (!storedToken) {
			throw new Error("No stored token found in the database")
		}
		const refreshtoken = storedToken.refreshToken
		const token = await getValidTokenFromServer(refreshtoken)

		// update the stored token with the new access token and expiration date
		storedToken.accessToken = token.accessToken
		storedToken.expirationDate = newExpirationDate()
		await storedToken.save()

		return token.accessToken
	} else {
		console.log("tokens.js 11 | token not expired")
		const storedToken = await Token.findOne({})
		if (!storedToken) {
			throw new Error("No stored token found in the database")
		}
		return storedToken.accessToken
	}
}

module.exports = {
	getToken,
}
