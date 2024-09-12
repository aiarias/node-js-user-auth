import DBLocal from 'db-local'
import crypto from 'crypto'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, required: true },
  password: { type: String, required: true }
})

export class UserRepository {
  static create ({ username, password }) {
    // 1. validaciones de username (opcional: usar zod)
    if (typeof username !== 'string') throw new Error('username must be a string')
    if (username.length < 4) throw new Error('username must be at least 4 characters long')

    if (typeof password !== 'string') throw new Error('password must be a string')
    if (password.length < 6) throw new Error('password must be at least 6 characters long')

    // 2. buscar si el usuario ya existe (asegurarse de que no exista)

    const user = User.findeOne({ username })
    if (user) throw new Error('user already exists')

    const id = crypto.randomUUID()

    User.create({
      _id: id,
      username,
      password
    }).save()

    return id
  }
  // static login ({ username, password }) {}
}
