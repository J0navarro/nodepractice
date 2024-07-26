const mongoose = require('mongoose')
const envi = require('./config')


const connectdb = async () => {
    try {
      const uri = envi.MONGODB_URI; // Obtener la URI de la variable de entorno
      await mongoose.connect(uri);
      console.log('Conexión a MongoDB exitosa');
    } catch (error) {
      console.error('Error al conectar a MongoDB:', error.message);
      process.exit(1); // Salir del proceso en caso de error
    }
  };
  
  module.exports = connectdb;

