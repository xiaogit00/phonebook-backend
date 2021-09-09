const express = require('express')
var morgan = require('morgan')

const app = express()

app.use(express.json())
morgan.token('data', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :response-time :data'))



let persons = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Lei",
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const totalRecords = persons.length
  response.send(`<p>Phonebook has info for ${totalRecords} people </p>
    <p>${new Date}</p>
    `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id )

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }

})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateID = (max) => Math.floor(Math.random() * max)

app.post('/api/persons', (request, response) => {
  const body = request.body

  const personExists = (persons.filter(person => person.name === body.name).length > 1) ? true : false

  if (!body.name || !body.number) {
    return response.status(404).json({
      error: 'content missing'
    })
  } else if (personExists) {
    return response.status(400).json({
      error: 'person exists'
    })
  } else {
    const person = {
      id: generateID(10000000),
      name: body.name,
      number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
  }

})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
