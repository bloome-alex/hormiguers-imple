import logger from '../../../../settings/logger'
import { pingService } from '../services'

export default async function(req, res){
    try {
        const ping = await pingService()
        res.status(200).send(ping)
    } catch (error) {
        logger.error('Error at ping controller: ', error.message)
    }
}