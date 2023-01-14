const mongoose = require('mongoose')

const shiftsSchema = new mongoose.Schema({
        id: String,
        startShift: String,
        endShift: String,

}, {collection:'shifts'})

module.exports = mongoose.model('Shifts', shiftsSchema)