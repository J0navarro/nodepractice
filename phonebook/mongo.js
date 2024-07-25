const mongoose = require('mongoose');

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://joanavarror:${password}@cluster-phonebook.zx67xyi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-PhoneBook`

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
    
    noteSchema.set('toJSON', {
        transform: (document, returnedObject) => {
          returnedObject.id = returnedObject._id.toString()
          delete returnedObject._id
          delete returnedObject.__v
        }
      })
    
    const personSchema = new mongoose.Schema({
      name: String,
      number: String,
    });

    const Person = mongoose.model('Person', personSchema);

    if (name && number) {
      const person = new Person({
        name,
        number,
      });

      return person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`);
        return mongoose.connection.close();
      });
    } else {
      return Person.find({}).then(persons => {
        console.log('phonebook:');
        persons.forEach(person => {
          console.log(`${person.name} ${person.number}`);
        });
        return mongoose.connection.close();
      });
    }
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
  });