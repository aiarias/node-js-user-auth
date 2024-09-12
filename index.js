import express from 'express'
import { PORT } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express()
app.use(express.json()) // esto es un middleware que viene con express y eso es para que express pueda entender el body de las peticiones

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.post('/login', (req, res) => {})
app.post('/register', async (req, res) => {
    const { username, password } = req.body
    console.log(req.body)

    try {
        const id = await UserRepository.create({ username, password })
        res.send({ id })
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