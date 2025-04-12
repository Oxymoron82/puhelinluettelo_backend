const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Custom token to log POST request bodies
morgan.token('body', (req) => {
    return req.method === 'POST' && req.body ? JSON.stringify(req.body) : '';
});

// Use morgan with the custom format
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const requestLogger = (req, res, next) => {
    console.log("Method", req.method)
    console.log("Path", req.path)
    console.log("Body", req.body)
    console.log("---")
    next()
}

let persons = [
    { id: 1, name: "Arto Hellas", number: "040-123456" },
    { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
    { id: 3, name: "Dan Abramov", number: "12-43-234345" },
    { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
];

// GET Home
app.get("/", (req, res) => {
    res.send("<h1>Hello from backend</h1>");
});

// GET info
app.get("/info", (req, res) => {
    const currentTime = new Date().toString();
    const numberOfEntries = persons.length;
    res.send(`<p>Phonebook has info for ${numberOfEntries} people</p><p>${currentTime}</p>`);
});

// GET all persons
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

// GET person by id
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

// DELETE person
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
});

// POST new person
app.post('/api/persons', (req, res) => {
    const body = req.body;

    // Validate name and number
    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'Name or number is missing' });
    }

    // Check if the name already exists
    if (persons.some(person => person.name === body.name)) {
        return res.status(400).json({ error: 'Name must be unique' });
    }

    // Generate a new ID as the max ID + 1
    const newId = Math.max(...persons.map(person => person.id)) + 1;

    const newPerson = {
        id: newId,
        name: body.name,
        number: body.number
    };

    // Add the new person to the array
    persons = persons.concat(newPerson);
    res.json(newPerson);
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
