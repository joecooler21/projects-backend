const mongoose = require('mongoose');

// Define schema
const employeesSchema = new mongoose.Schema({
  id: String,
  firstName: String,
  lastName: String,
}, {collection:'employees'} );

// Define model
const Employee = mongoose.model('Employees', employeesSchema);

module.exports = Employee;
