import winston from 'winston'
import { format } from 'winston'
import Dayjs from 'dayjs'
import colors from 'colors'

const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(info => {
            const date = colors.blue(Dayjs(info.timestamp).format('YYYY-MM-DD hh:mm:ss'))
            const level = info.level
            const message = info.message

            return date + ' ' + level + ' ' + message
        })
    ),
    defaultMeta: { service: process.env.APP_NAME },
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
})

export default logger