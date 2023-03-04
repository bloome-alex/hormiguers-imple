import express from 'express'
import {
    pingController
} from '../controllers'

const router = express.Router()

router.get('/ping', pingController)

export default router