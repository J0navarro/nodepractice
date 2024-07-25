const mongoose = require('mongoose');

// Definir el esquema
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });
  //Formateo de respuesta
  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

// Crear el modelo
const Person = mongoose.model('Person', personSchema);

module.exports = Person;