const mongoose = require('mongoose');

// Definir el esquema
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
      },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(numero) {
                const regex = /^\d{2,3}-\d+$/; // Validar el formato "XX-XXXXXXX" o "XXX-XXXXXXXX"
                return regex.test(numero);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: true
      },
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