const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
    id: String,
    date: String,
    shifts: [{
        id: String,
        firstName: String,
        lastName: String,
        jobTitle: String,
        startShift: String,
        endShift: String
    }]

}, {collection:'schedules'})

module.exports = mongoose.model('Schedule', scheduleSchema)