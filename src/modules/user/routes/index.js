import express from 'express'
import { body } from 'express-validator'
import { authMiddleware } from '../middlewares'
import { authController, loginController, paginateController, registerController } from '../controllers/userControllers'

const router = express.Router()

router.post('/register', [
  body('email').isEmail().withMessage('El correo electrónico debe ser válido'),
  body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('role').isIn(['hormiguer', 'client']).withMessage('El rol debe ser "hormiguer" o "client"')
], registerController)

router.post('/login', [
  body('email').isEmail().withMessage('El correo electrónico debe ser válido'),
  body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
], loginController)

router.get('/', authMiddleware, paginateController)

router.get('/me', authMiddleware, authController)

export default router