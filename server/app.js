const express = require("express")
const app = express()
require("dotenv").config()
const bodyParser = require("body-parser")
const cors = require("cors")
const Token = require("./models/token")
const fetch = require("node-fetch")
const getToken = require("./controllers/getToken")
app.use(bodyParser.json())
app.use(cors())

const { google } = require("googleapis")

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	"http://localhost:8080/handleGoogleRedirect" // server redirect url handler
)

app.post("/createAuthLink", cors(), (req, res) => {
	const url = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: [
			"https://www.googleapis.com/auth/userinfo.email",
			//calendar api scopes]
			"https://www.googleapis.com/auth/calendar",
		],
		prompt: "consent",
	})
	res.send({ url })
})

app.get("/handleGoogleRedirect", async (req, res) => {
	// get code from url
	const code = req.query.code
	console.log("server 36 | code", code)
	// get access token
	oauth2Client.getToken(code, (err, tokens) => {
		if (err) {
			console.log("server 39 | error", err)
			throw new Error("Issue with Login", err.message)
		}
		const accessToken = tokens.access_token
		const refreshToken = tokens.refresh_token

		res.redirect(`http://localhost:3000?accessToken=${accessToken}&refreshToken=${refreshToken}`)
	})
})

app.post("/getValidToken", async (req, res) => {
	try {
		const request = await fetch("https://www.googleapis.com/oauth2/v4/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				client_id: process.env.GOOGLE_CLIENT_ID,
				client_secret: process.env.GOOGLE_CLIENT_SECRET,
				refresh_token: req.body.refreshToken,
				grant_type: "refresh_token",
			}),
		})

		const data = await request.json()
		console.log("server 74 | data", data.access_token)

		res.json({
			accessToken: data.access_token,
		})
	} catch (error) {
		res.json({ error: error.message })
	}
})

/*
app.post("/storeTokenData", async (token, refreshToken, expirationDate) => {
	const newToken = new Token({
		accessToken: token,
		refreshToken: refreshToken,
		expirationDate: expirationDate,
	})

	try {
		await newToken.save()
	} catch (error) {
		console.log(error)
	}
})

app.get("/getCalendarEvents", async (req, res) => {
	try {
		const calendarId = req.query.calendarId
		const events = await getCalendarEvents(calendarId)
		await saveCalendarEvents(events)
		res.send(events)
	} catch (error) {
		console.error(error)
		res.status(500).send(error.message)
	}
})*/

module.exports = app
