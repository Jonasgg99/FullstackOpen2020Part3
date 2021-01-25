const express = require('express')
const app = express()


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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})