const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('dist'))

morgan.token('body', (req) => req.body && Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : '');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


let data = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    },
    {
        "id": "5",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
})

app.get('/api/persons', (req, res) => {
    res.json(data);
})

app.get("/info", (req, res) => {
    const currentDate = new Date();
    res.send(
        `<p>Phonebook has info for ${data.length} people</p>

<p>${currentDate.toUTCString()}</p>
    `)
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = data.find(note => note.id === id);
    if (person) {
        res.status(200).json(person);
    } else {
        res.status(404).json({"error": "Person not found"});
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const initialLength = data.length;

    data = data.filter(person => person.id !== id);

    if (data.length === initialLength) {
        res.status(404).json({error: "Person not found"});
    }

    res.status(200).json({message: "Person deleted successfully."});
});

const generateId = () => {
    const maxId = data.length > 0
        ? Math.max(...data.map(n => Number(n.id)))
        : 0
    return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    const personExists = data.find(p => p.name === body.name);

    if (personExists) {
        return response.status(400).json({
            error: 'person already exists'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    data = data.concat(person)

    response.json(person)
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
