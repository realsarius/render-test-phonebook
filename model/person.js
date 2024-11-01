const mongoose = require('mongoose');

const person = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
    },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return /^\d{2,3}-\d{5,}$/.test(v); // Regex for the desired format
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        minlength: 8,
        required: true
    }
});

const Person = mongoose.model('Person', person);

module.exports = Person;