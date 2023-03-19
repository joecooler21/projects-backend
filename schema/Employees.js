const mongoose = require('mongoose');

// Define schema
const employeesSchema = new mongoose.Schema({
  id: String,
  firstName: String,
  lastName: String,
});

// Define model
const Employee = mongoose.model('employees', employeesSchema);

module.exports = Employee;
