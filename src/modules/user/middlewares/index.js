import jwt from 'jsonwebtoken'
import logger from '../../../../settings/logger'

export const authMiddleware = (req, res, next) => {
    // Obtener el token de autenticación de la cabecera
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
        logger.info('Solicitud no autenticada')
        return res.status(401).json({ error: 'No autorizado' })
    }

    try {
        // Verificar el token y decodificar el usuario
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.token = token
        req.user = decoded
        next()
    } catch (err) {
        logger.info('Token inválido')
        res.status(401).json({ error: 'No autorizado' })
    }
}