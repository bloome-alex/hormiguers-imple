import logger from "../../../../settings/logger"

const requestLoggerMiddleware = (req, _, next) => {
    const { method, path } = req
        logger.info(`${method} request to ${path}`)
    next()
}

export default requestLoggerMiddleware