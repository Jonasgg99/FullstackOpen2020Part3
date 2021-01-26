const express = require('express')
const app = express()

app.use(express.json())

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

  console.log(persons.length)
const info = () => {
    return (
        `Phonebook has info for ${persons.length} people
${new Date()}`   
    )
}

const alreadyIncluded = person => {
    if (persons.find(p => p.name.toLowerCase() === person.toLowerCase())) {
        return true
    }
    return false
}

app.get('/info', (request,response) => {
    response.send(info())
})

app.get('/', (request,response) => {
    response.send('root')
})

app.get('/api/persons', (request,response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id',(request,response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
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

    const newPerson = {
        name:body.name,
        number:body.number,
        id:getRandomInt()
    }
    
    console.log(newPerson)
    persons = persons.concat(newPerson)
    response.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})