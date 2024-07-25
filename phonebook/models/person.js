const mongoose = require('mongoose');

// Definir el esquema
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

// Crear el modelo
const Person = mongoose.model('Person', personSchema);

module.exports = Person;