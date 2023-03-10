import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import logger from '../../../../settings/logger'
import User from '../models/User'

export const register = async (email, password, role) => {
  //¿Existe algun usuario con ese email?

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    logger.info('Se intentó registrarse con un correo electrónico ya existente.')
    throw new Error('Correo electrónico ya registrado')
  }

  // Cifrar la contraseña
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Crear un nuevo usuario
  const user = new User({ email, password: hashedPassword, role })
  await user.save()

  return user
}

export const login = async (email, password) => {
  // Verificar si el correo electrónico existe
  const user = await User.findOne({ email })
  if (!user) {
    logger.info('Intento de inicio de sesión con credenciales inválidas')
    throw new Error('Credenciales inválidas')
  }

  // Verificar la contraseña
  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    logger.info('Intento de inicio de sesión con credenciales inválidas')
    throw new Error('Credenciales inválidas')
  }

  // Generar un token de autenticación
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)

  return { user, token }
}

export const getAllUsers = async (page = 1, limit = 10) => {
  // Calcular el índice de inicio y el número de documentos a devolver
  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  // Obtener el número total de documentos
  const totalDocuments = await User.countDocuments()

  // Obtener los usuarios en la página actual
  const users = await User.find()
    .skip(startIndex)
    .limit(limit)
    .exec()

  // Crear un objeto de paginación
  const pagination = {}
  if (endIndex < totalDocuments) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  return { users, pagination }
}

export const getUserByToken = async (token) => {
    try {
        // Verificar el token y obtener el ID del usuario
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.userId

        // Buscar el usuario en la base de datos
        const user = await User.findById(userId)

        // Si el usuario no existe, lanzar un error
        if (!user) {
            logger.info('Intento de autenticación con un token válido pero un usuario inexistente.')
            throw new Error('Usuario no encontrado')
        }

        return user
    } catch (err) {
        logger.info('Intento de autenticación con un token inválido.')
        throw new Error('Token inválido')
    }
  }
  