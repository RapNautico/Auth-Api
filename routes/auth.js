const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, Login, validateToken } = require('../controllers/auth');
const { validatedCampos } = require('../middlewares/validate');
const { validateJWT } = require('../middlewares/validate_token');

const router = Router();

// Create a new server
router.post('/new', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty().isLength({ min: 6 }),
    validatedCampos
],createUser);

// Login
router.post('/', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a valid password').isLength({ min: 6 }),
    validatedCampos
] ,Login);

// Validate token
router.get('/renew', validateJWT ,validateToken);

module.exports = router;