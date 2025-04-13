const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phone = process.argv[4]

const url = `mongodb+srv://seb:${password}@cluster0.bdkako1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phoneBookSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
})
const Phonebook = mongoose.model('Phonebook', phoneBookSchema)

// adding a new user and phone 
const newPerson = new Phonebook({
  name: name,
  phoneNumber: phone,
})
newPerson.save().then(result => {
  console.log('new person saved!')
//   mongoose.connection.close()
})

// display person in the phone book
Phonebook.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })