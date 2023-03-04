import dotenv from 'dotenv'
dotenv.config()
import logger from '../settings/logger'
import init from './init'
import Server from './Server'

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT

const main = async() => {
    try {
        await init({
            MONGODB_URI
        })
        const server = new Server(PORT)
        server.start()
    } catch (error) {
        logger.error('Error at main function: ', error)
    }
}

main()