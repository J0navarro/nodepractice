const express = require('express')
const morgan = require('morgan')
const connectdb = require('./utils/conectdb')
const Person = require('./models/person');
const envi = require('./utils/config')
const logger = require('./utils/logger')

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

app.post('/api/persons', (request, response, next) => {
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
  .catch(error => next(error))
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, 
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/info', (request, response) => {
  let fechaActual = new Date();
  logger.info(fechaActual.toString());
  const mensaje = `PhoneBook has info for: ${response.length} persons <p>${fechaActual.toString()}</p>`;
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
    if (result) {
      response.status(204).end()
    }
    
  })
  .catch(error => next(error))
});


const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    logger.error(error.message)
    return response.status(400).json({ error: 'Error de Validacion'})
  }

  next(error)
}

// este debe ser el último Middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler)

const PORT = envi.PORT || 3001
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})