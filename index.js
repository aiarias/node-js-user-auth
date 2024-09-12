import express from 'express'
import { PORT } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express()

app.set('view engine', 'ejs') // esto es para configurar el motor de plantillas
app.use(express.json()) // esto es un middleware que viene con express y eso es para que express pueda entender el body de las peticiones

app.get('/', (req, res) => {
    res.render('example', { username: 'aiarias' }) // esto es para renderizar una plantilla
})

app.post('/login',async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await UserRepository.login({ username, password })
        res.send(user)
    } catch (error) {
        res.status(401).send(error.message)
    }
})
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