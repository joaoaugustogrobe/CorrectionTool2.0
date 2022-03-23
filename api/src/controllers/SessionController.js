const jwt = require('jsonwebtoken')
const Guard = require('../Authorization/Guard')

require('dotenv').config()
module.exports = {
    validar(req, res, next, type) {
        const token = req.cookies['x-access-token'] ? req.cookies['x-access-token'] : (req.headers['authorization']||'').replace('Bearer ', '');
        jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
            // console.log(req.url, err ? 'ERROR' : 'OK');
            if (err)
                return res.status(401).send({ status: "error", message: err.message, data: null })
            if (type && decoded.role != type)
                return res.status(403).send({ status: "error", message: `Rota exclusiva para ${type}`, data: null })
            req.body.userId = decoded.id
            req.body.role = decoded.role
            req.body.user = {
                ...decoded,
                can: (modulo, payload) => Guard.can(modulo, {userId: decoded.id, ...payload}),
                cannot: (modulo, payload) => Guard.cannot(modulo, {userId: decoded.id, ...payload}),
            }
            next()
        })
    },
    generateToken(data){
        return jwt.sign(data,process.env.JWT_KEY)
        
    }
};
