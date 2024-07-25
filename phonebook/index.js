const express = require('express')
const morgan = require('morgan')
const connectdb = require('./config/conectdb')
const Person = require('./models/person');
require('dotenv').config()

const app = express()

app.use(express.static('dist'))
app.use(express.json());

connectdb();
// Crear un token para mostrar los datos del cuerpo
morgan.token('body', (req) => JSON.stringify(req.body));

// Configuración de morgan para registrar en la consola
app.use(morgan(':method :url :body'));

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
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

 

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
    
  })
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})