const mongoose = require('mongoose')
const db = mongoose.connection.useDb('test')



const employeesSchema = new mongoose.Schema({
        id: String,
        firstName: String,
        lastName: String,

})

const collection = db.model('employees', employeesSchema)

module.exports = { collection }

// module.exports = mongoose.model('Employees', employeesSchema)