const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const employeeDetailsSchema = new Schema({
    
    name: {
        required: true,
        type: String
    },
    department: {
        required: true,
        type: String
    },
    dob: {
        required: true,
        type: String
    },
    gender: {
        required: true,
        type: String
    },
    designation: {
        required: true,
        type: String
    },
    salary: {
        required: true,
        type: Number
    },
    id: {
        required: false,
        type:String
    }

});

const employeeDetails = mongoose.model('employeeDetails', employeeDetailsSchema, 'employee_details');
module.exports = employeeDetails;