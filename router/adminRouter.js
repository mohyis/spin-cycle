const router = require('express').Router()
const passport = require('passport')
const { register, login } = require('../controller/adminController')
const { authenticator } = require('../middleware/validation')

router.post('/', register)
router.post('/login', login)

router.get('/googleAuth', passport.authenticate("google", {scope: ["profile", "email"]}))
router.get('/googleLogin', passport.authenticate("google", {successRedirect: "/api/user/success", failureRedirect: "/api/user/failed"}))

router.get('/success', (req, res)=>{
    res.json({
        message: "login successful",
        data: req.user
    })
})

router.get('/failed', (req, res)=>{
    res.json({
        message: "login Failed"
    })
})

module.exports = router