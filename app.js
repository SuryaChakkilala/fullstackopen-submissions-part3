const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const uniqueValidator = require('mongoose-unique-validator')

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] :response-time ms :persons'))

const personSchema = mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    name: {type: String, required: true, unique: true},
    number: {type: String, required: true, unique: true}
})

const Person = mongoose.model('Person', personSchema)

app.get('/api/persons', async (req, res) => {
    const personList = await Person.find()

    if(personList.length===0) return res.status(404).json({err: 'person not found'})
    res.status(201).send(personList) 
})

app.post('/api/persons', async (req, res) => {
    let person = new Person({
        name: req.body.name,
        id: req.body.id,
        number: req.body.number
    })

    if(person.name.length < 3) return res.status(404).json({err: 'minimum length 3'})

    person = await person.save()
    if(!person) return res.status(404).json({err: 'person not saved'})
    res.status(200).send(person)
})

app.delete('/api/persons/:id', async (req, res)=>{
    const person = await Person.findByIdAndDelete(req.params.id)

    if(!person) return res.status(404).json({success: false})
    res.status(201).send(person)
})

app.put('/api/persons/:id', async (req, res) => {
    const person = await Person.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        id: req.body.id,
        number: req.body.number
    },
    {new: true})

    if(!person) return res.status(404).json({success: false})
    res.status(200).send(person)
})

app.get('/info', async (req, res) => {
    const personList = await Person.find()

    const count = personList.length

    let date_ob = new Date();

    let date = ("0" + date_ob.getDate()).slice(-2);


    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);


    let year = date_ob.getFullYear();


    let hours = date_ob.getHours();

    let minutes = date_ob.getMinutes();

    let seconds = date_ob.getSeconds();

    res.send(`Phonebook has info for ${count} people\n${year}-${month}-${date} ${hours} : ${minutes} : ${seconds}`)
})

app.get('/api/persons/:id', async (req, res) => {
    const person = await Person.findById(req.params.id)

    if(!person) return res.status(500).json({success: false})
    res.status(201).send(person)
})

mongoose.connect('mongodb+srv://admin:admin@cluster0.3onwg.mongodb.net/person?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'person'
}).then(()=>{
    console.log('connection to database successful')
}).catch(err => {
    console.log(err)
})

app.listen(3001, ()=>{
    console.log('Server running on http://localhost:3001')
})