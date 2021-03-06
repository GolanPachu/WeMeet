// define the meetings schema

const mongoose = require('mongoose');

const Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

let schema = mongoose.Schema({
	id: String,
	name: String,
	creator: {
		type: ObjectId,
		ref: "User"
	},
	// flag if the algorithm find date to the meeting
	isDetermined: Boolean,
	// the desired date for the meeting (the deadline)
	actualDate: Date,
	meetLengthInSeconds: Number,
	fromDate: Date,
	toDate: Date,
	invited: [{
		type: ObjectId,
		ref: "User"
	}],
	location: String,
	accepted: [{
		type: ObjectId,
		ref: "User"
	}],
	rejected: [{
		type: ObjectId,
		ref: "User"
	}],
	duration: Number
});


module.exports = mongoose.model('Meeting', schema);