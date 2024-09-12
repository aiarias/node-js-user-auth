import express from 'express'
import { PORT } from './config.js'
import { UserRepository } from './repositories/UserRepository.js'

const app = express()

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.post('/login', (req, res) => {})
app.post('/register', (req, res) => {
    const { username, password } = req.body
    console.log(req.body)

    try {
        const id = UserRepository.create({ username, password })
    } catch (error) {
        // NORMALMENTE NO SE DEBE ENVIAR EL MENSAJE DE ERROR
        res.status(400).send(error.message)
    }
})
app.post('/logout', (req, res) => {})

app.post('/protected', (req, res) => {})

app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`)
})