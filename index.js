require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('text', function (req,res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :text :date[web]'))

const getRandomInt = () => Math.floor(Math.random() * Math.floor(9999))

let persons = [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
    ]

const info = number => {
    return (
        `Phonebook has info for ${number} people
${new Date()}`   
    )
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  


const alreadyIncluded = person => persons.find(p => p.name.toLowerCase() === person.toLowerCase())

app.get('/info', (request,response) => {
    Person.count().then(number => {
        response.send(info(number))
    })
})

app.get('/api/persons', (request,response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request,response,next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id',(request,response,next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        console.log(result)
        response.status(204).end()
    })
    .catch(error => next(error))
    /*persons = persons.filter(person => person.id !== id)

    response.status(204).end()*/
})

app.put('/api/persons/:id', (request,response,next) => {
    const body = request.body

    const updatedPerson = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, updatedPerson, { new: true })
    .then(result => {
        response.json(result)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request,response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    } else if (alreadyIncluded(body.name)) {
        return response.status(400).json({
            error: 'person already exists'
        })
    }

    const newPerson = new Person({
        name:body.name,
        number:body.number
    }) 
    
    newPerson.save().then(savedPerson => {
        response.json(savedPerson)
        /*persons = persons.concat(newPerson)*/
    })
    
})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  app.use(errorHandler)

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Server running on ${port}`);
})