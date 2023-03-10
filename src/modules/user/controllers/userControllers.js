import { validationResult } from 'express-validator'
import logger from '../../../../settings/logger'

import { register, login, getAllUsers, getUserByToken } from '../services/userServices'

export const registerController = async (req, res) => {
    // Comprobar si se produjeron errores de validación
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // Registrar el usuario
    try {
        const user = await register(req.body.email, req.body.password, req.body.role)
        logger.info('Un nuevo usuario se ha registrado.')
        return res.status(201).json(user)
    } catch (err) {
        logger.error(err.message)
        return res.status(400).json({ error: err.message })
    }
}

export const loginController = async (req, res) => {
    // Comprobar si se produjeron errores de validación
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // Iniciar sesión
    try {
        const { user, token } = await login(req.body.email, req.body.password)
        logger.indo('Un usuario ha iniciado sesión en el sistema.')
        return res.json({ user, token })
    } catch (err) {
        logger.error(err.message)
        return res.status(400).json({ error: err.message })
    }
}

export const paginateController = async (req, res) => {
    // Obtener los parámetros de paginación de la solicitud
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    // Obtener los usuarios
    try {
        const { users, pagination } = await getAllUsers(page, limit)
        res.json({ users, pagination })
    } catch (err) {
        logger.error(err.message)
        res.status(400).json({ error: err.message })
    }
}

export const authController = async (req, res) => {
    // Obtener el usuario correspondiente al token de autenticación
    try {
      const user = await getUserByToken(req.token)
      res.json(user)
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ error: err.message })
    }
  }