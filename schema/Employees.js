const mongoose = require('mongoose')
const db = mongoose.connection.useDb('test')
const collection = db.model('employees', employeesSchema)


const employeesSchema = new mongoose.Schema({
        id: String,
        firstName: String,
        lastName: String,

}, {collection:'employees'})

module.exports = { collection }

// module.exports = mongoose.model('Employees', employeesSchema)