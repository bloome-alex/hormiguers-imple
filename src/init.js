import database from '../settings/database.js'

const initialization = async ({
    MONGODB_URI
}) => {
    await database.connect(MONGODB_URI)
}

export default initialization