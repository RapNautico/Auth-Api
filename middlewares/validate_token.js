const { response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = async(req, res = response, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'Please login'
        });
    }
    try {
        const {uid, name} = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        req.name = name;
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Error: Invalid token'
        });
    }


    next();
}

module.exports = {
    validateJWT
};