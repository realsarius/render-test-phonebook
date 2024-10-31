require('dotenv').config();
const Person = require('./model/person');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const {mongo} = require("mongoose");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('dist'))

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose.connect(url);

morgan.token('body', (req) => req.body && Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : '');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then((persons) => {
        res.json(persons);
    })
})

app.get("/info", (req, res) => {
    Person.find({}).then(persons => {
        const currentDate = new Date();

        res.send(
            `<p>Phonebook has info for ${persons.length} people</p>

                <p>${currentDate.toUTCString()}</p>
                    `)
    })

});

app.get('/api/persons/:id', (req, res) => {
    const personId = req.params.id;

    Person.findById(personId)
        .then(person => {
            if (person) {
                res.status(200).json(person);
            } else {
                res.status(404).json({error: "person not found"});
            }
        }).catch(error => {
        res.status(500).json({error: "invalid ID format", details: error.message})
    });

});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;

    Person.findByIdAndDelete(id)
        .then(deletedPerson => {
            if (deletedPerson) {
                res.status(200).json({message: "Person deleted successfully."});
            } else {
                res.status(404).json({error: "Person not found"});
            }
        })
        .catch(error => {
            res.status(500).json({error: "Delete operation failed.", details: error.message});
        });
});


app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (body.name === undefined) {
        return response.status(400).json({error: "Name is required"});
    }

    const person = new Person({
        name: body.name,
        phone: body.phone,
    });

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
