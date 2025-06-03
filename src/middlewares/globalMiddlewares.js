import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';
import CustomError from '../utils/CustomError.js';



const generateToken = async (id_user, email_user, type_user) => {
    return jwt.sign(
      {
        userId: id_user,
        email: email_user,
        levelUser: type_user,
      },
      process.env.JWT_SECRET, {
          expiresIn: 43200 // 12 hours
      }
  );
};

const jwtRequired = (req, res, next) => {
    const token = req.cookies.token;
    if (!token || typeof token !== 'string') {
        logger.warn('Access denied. No token provided.');
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
  
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.levelUser = decoded.levelUser;
        req.email = decoded.email;

        next();

    } catch (error) {

        if (error.name === 'JsonWebTokenError') {
            logger.warn(`Token JWT inválido recebido: ${error.message}`);
            res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax', path: '/' });
            return next(new CustomError('Sessão inválida. Por favor, faça login novamente.', 401));
        }
        
        if (error.name === 'TokenExpiredError') {
            logger.info(`Token JWT expirado para usuário.`);
            
            res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax', path: '/' });
            return next(new CustomError('Sua sessão expirou. Por favor, faça login novamente.', 401));
        }
            
        logger.error(`Erro inesperado na verificação do JWT: ${error.message}`);
        return next(new CustomError('Erro interno durante a autenticação.', 500));
    };
}

const isMaster = async (req, res, next) => {
    if (req.levelUser !== 'master') {
        logger.warn('Access denied. User is not a master.');
        return res.status(403).json({ message: 'Access denied. User not allowed to create events'});
    }
    next();
};
 
export default {
    generateToken,
    jwtRequired,
    isMaster,
}