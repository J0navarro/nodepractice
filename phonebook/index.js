const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json());

// Crear un token para mostrar los datos del cuerpo
morgan.token('body', (req) => JSON.stringify(req.body));

// Configuración de morgan para registrar en la consola
app.use(morgan(':method :url :body'));
let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})
app.get('/api/info', (request, response) => {
  let fechaActual = new Date();
  console.log(fechaActual.toString());
  const mensaje = `PhoneBook has info for ${persons.length} persons <p>${fechaActual.toString()}</p>`;
  response.setHeader('Content-Type', 'text/html');
  response.end(mensaje);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id  
  const person = persons.find(person  => person.id == id)
  if (person) {
    response.json(person);
  } else {
    response.status(404).json({ error: 'Persona no encontrada' });
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  
  // Filtrar la lista de personas
  persons = persons.filter(person => person.id !== id);

  // Responder con un estado 204 (No Content)
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;

  // Verificar si falta el nombre o el número
  if (!name || !number) {
    return response.status(400).json({ error: 'name or number is missing' });
  }

  // Verificar si el nombre ya existe
  const existingPerson = persons.find(person => person.name === name);
  if (existingPerson) {
    return response.status(400).json({ error: 'name must be unique' });
  }

  // Generar un nuevo ID
  const id = Math.floor(Math.random() * 1000000); // Rango grande para evitar duplicados

  // Crear la nueva persona
  const newPerson = { id, name, number };
  persons.push(newPerson);

  // Responder con el nuevo objeto creado
  response.status(201).json(newPerson);
});

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})