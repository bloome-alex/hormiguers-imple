import express from 'express'
import logger from '../settings/logger'

import BaseRoutes from './modules/base'
import UserRoutes from './modules/user'

import requestLoggerMiddleware from './modules/base/middlewares/requestLogger'

class Server {
    constructor(port){
        // Singleton pattern to make sure that only one instance of the class is created
        if (Server.instance){
            return Server.instance
        }
        
        // Validating the port number and throwing an error if it's invalid
        if(!port || isNaN(Number(port))){
            logger.error(`Server error - Invalid port number or undefined`)
            process.exit(1)
        }
        
        // Initializing the server properties
        this.port = port
        this.server = null
        this.app = express()

        // Initializing the middlewares and routes
        this.middlewares()
        this.routes()

        // Saving the instance in a static property of the class
        Server.instance = this
    }

    middlewares(){
        // Adding the JSON middleware to parse incoming requests as JSON
        this.app.use(express.static('public'))
        this.app.use(express.json())
        this.app.use('/api', requestLoggerMiddleware)
    }

    routes(){
        // Adding the base routes to the express app
        this.app.use('/api', BaseRoutes)
        this.app.use('/api/user', UserRoutes)
    }

    start(){
        try {
            // Starting the server and logging a message when it's listening on a port
            this.server = this.app.listen(this.port, () => {
                logger.info(`server listening at port ${this.port}`)
            })
        } catch (error) {
            // Handling errors when starting the server
            logger.error(`Error starting server: ${error.message}`)
            process.exit(1)
        }
    }

    stop(){
        if(!this.server) {
            // If the server is not running, log a message and return
            logger.warn(`Server is not running`)
            return
        }

        try {
            if (this.server) {
                    // Stopping the server and logging a message when it's stopped
                this.server.close(()=>{
                    logger.info('Server has stopped')
                })
            }
        } catch (error) {
            // Handling errors when stopping the server
            logger.error(`Error stopping server: ${error.message}`)
            process.exit(1)
        }
    }
}

export default Server