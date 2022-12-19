import mongoose from "mongoose"

const calendarEventSchema = new mongoose.Schema({
	// define the fields for the calendar event model
	start: {
		type: Date,
		required: true,
	},
	end: {
		type: Date,
		required: true,
	},
	summary: {
		type: String,
		required: true,
	},
	// ... other fields as needed
})

const CalendarEvent = mongoose.model("CalendarEvent", calendarEventSchema)

module.exports = {
	CalendarEvent,
}
