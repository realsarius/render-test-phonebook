const mongoose = require('mongoose');

const person = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
    },
    phone: String,
});

const Person = mongoose.model('Person', person);

module.exports = Person;