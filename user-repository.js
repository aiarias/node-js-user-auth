import DBLocal from 'db-local'
import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from './config.js'

const { Schema } = new DBLocal({ path: './db' })

const Session = Schema('Session', {
  _id: { type: String, required: true },
  userId: { type: String, required: true },
  expires: { type: Date, required: true }
})

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

export class UserRepository {
  static async create ({ username, password }) {
    // 1. validaciones de username (opcional: usar zod) y para la contraseña
    Validation.username(username)
    Validation.password(password)

    // 2. buscar si el usuario ya existe (asegurarse de que no exista)

    const user = User.findOne({ username })
    if (user) throw new Error('user already exists')

    const id = crypto.randomUUID()

    // const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS) // hashSync -> bloquea el thread principal
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS) // hash -> no bloquea el thread principal
    User.create({
      _id: id,
      username,
      password: hashedPassword
    }).save()

    return id
  }

  static async login ({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    const user = User.findOne({ username })
    if (!user) throw new Error('user not found')

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new Error('invalid password')

    const { password: _, ...publicUser } = user // esto es para quitar propiedades a un objeto (no devolver la contraseña)

    return publicUser
  }
}

class Validation {
  static username (username) {
    if (typeof username !== 'string') throw new Error('username must be a string')
    if (username.length < 4) throw new Error('username must be at least 4 characters long')
  }

  static password (password) {
    if (typeof password !== 'string') throw new Error('password must be a string')
    if (password.length < 6) throw new Error('password must be at least 6 characters long')
  }
}
