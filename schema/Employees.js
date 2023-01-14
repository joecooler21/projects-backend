const mongoose = require('mongoose')

const employeesSchema = new mongoose.Schema({
        id: String,
        firstName: String,
        lastName: String,

}, {collection:'employees'})

module.exports = mongoose.model('Employees', employeesSchema)