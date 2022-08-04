const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const { validateJWT } = require('../middlewares/validate_token');

// POST Create a new server
const createUser = async(req, res = response) => {

    const { name, email, password } = req.body;
    
    try {
        // Email unique  
        const usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'User already exists'
            });
        }
        // Create user with the model
        const dbUser = new Usuario(req.body);
        // Hash password
        const salt =  bcrypt.genSaltSync();
        dbUser.password =  bcrypt.hashSync(password, salt);
        // generate token
        const token = await validateJWT(dbUser.id, name);
        // Save user in the database
        await dbUser.save();
        // Response
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            token
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Please speak to the administrator'
        }); 
    }

}
// POST Login
const Login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        // Find user by email
        const dbUser = await Usuario.findOne({ email });
        if (!dbUser) {
            return res.status(400).json({
                ok: false,
                msg: 'User not found'
            });
        }
        // Compare password
        const validPassword = bcrypt.compareSync(password, dbUser.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid password'
            });
        }
        
        // Generate token
        const token = await validateJWT(dbUser.id, dbUser.name);
        // Response
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please speak to the administrator'
        });
    } 
}
// GET Validate token
const validateToken = (req, res) => {

    const { uid, name } = req;
    const token = validateJWT(uid, name);

    return res.json({
        ok: true,
        uid,
        name,
        token
    });   
}

module.exports = {
    createUser,
    Login,
    validateToken
}