import axios from "axios"
import { getToken } from "../controllers/getToken"
const Token = require("../models/token")

const getCalendarEvents = async calendarId => {
	// get the stored token from the database
	const storedToken = await Token.findOne({})
	if (!storedToken) {
		throw new Error("No stored token found in the database")
	}
	const token = storedToken.accessToken

	// make a request to the Google Calendar API to retrieve the events for the specified calendar
	const response = await axios.request({
		url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	const events = response.data.items
	return events
}

const saveCalendarEvents = async events => {
	// save the events to the database
	events.forEach(async event => {
		const start = event.start.dateTime
		const end = event.end.dateTime
		const summary = event.summary
		const newEvent = new CalendarEvent({ start, end, summary })
		await newEvent.save()
	})
}

module.exports = {
	getCalendarEvents,
	saveCalendarEvents,
}

/*app.get("/getCalendarEvents", async (req, res) => {
	try {
		const calendarId = req.query.calendarId
		const token = await getToken()

		// make a request to the Google Calendar API to retrieve the events for the specified calendar
		const response = await axios.request({
			url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		const events = response.data.items
		res.send(events)
	} catch (error) {
		console.error(error)
		res.status(500).send(error.message)
	}
})*/
