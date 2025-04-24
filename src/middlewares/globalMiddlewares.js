import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

const generateToken = async (id, email) => {
    logger.info("Gerando token JWT");
    return jwt.sign(
        {
            id: id,
            email: email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: 86400
        }
    );
}
 
export default {
    generateToken
}