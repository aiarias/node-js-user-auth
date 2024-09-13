import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express()

app.set('view engine', 'ejs') // esto es para configurar el motor de plantillas
app.use(express.json()) // esto es un middleware que viene con express y eso es para que express pueda entender el body de las peticiones
app.use(cookieParser()) // esto es un middleware que viene con express y eso es para que express pueda entender las cookies

app.use((req, res, next) => {
  const token = req.cookies.access_token // esto es para obtener la cookie del token
  req.session = { user: null }
  try {
    const data = jwt.verify(token, SECRET_JWT_KEY) // esto es para verificar el token
    req.session.user = data
  } catch (error) {
    req.session.user = null
  }

  next() // seguir a la siguiente ruta o middleware
})

app.get('/', (req, res) => {
  const { user } = req.session // esto es para obtener el usuario de la sesion
  res.render('index', user)
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await UserRepository.login({ username, password })
    const token = jwt.sign({ id: user._id, username: user.username }, SECRET_JWT_KEY, {
      expiresIn: '1h'
    }) // aqui esta generando el token y lo esta firmando
    res.cookie('access_token', token, { // access_token es el nombre de la cookie
      httpOnly: true, // esto es para que el token no sea accesible desde el frontend ( solo se puede acceder en el servidor)
      secure: process.env.NODE_ENV === 'production', // esto es para que el token solo sea accesible si la peticion es https ( se pone true solo para produccion)
      sameSite: 'strict', // esto es para que el token sea accesible desde cualquier sitio o puedes ser 'strict' para que solo sea accesible desde el mismo sitio o puede ser lax para que sea accesible desde el mismo sitio o desde un sitio de terceros
      maxAge: 1000 * 60 * 60 // esto es para que el token expire en una hora
    }).send(user)
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
app.post('/logout', (req, res) => {
  res.clearCookie('access_token').send('logged out')
})

app.get('/protected', (req, res) => {
  const { user } = req.session
  if (!user) return res.status(401).send('unauthorized')
  res.render('protected', user)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
