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

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/info', (request, response) => {
  let fechaActual = new Date();
  console.log(fechaActual.toString());
  const mensaje = `PhoneBook has info for ${persons.length} persons <p>${fechaActual.toString()}</p>`;
  response.setHeader('Content-Type', 'text/html');
  response.end(mensaje);
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
});


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})