import mongoose from 'mongoose'
import logger from './logger'


export default {
    connect: async (uri) => {
        try {
            await mongoose.connect(uri)
            logger.info('Database conection successful')
        }catch(error){
            logger.error('Error to connect at database: ', error)
            process.exit(1)
        }
    },

    disconnect: async () => {
        try {
            await mongoose.disconnect()
            logger.info('Database disconnect succesful')
        }catch (error){
            logger.error('Error to disconnect at database: ', error)
            process.exit(1)
        }
    }
}