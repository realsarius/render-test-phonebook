const mongoose = require('mongoose');

const person = new mongoose.Schema({
    name: String,
    phone: String,
});

const Person = mongoose.model('Person', person);

module.exports = Person;