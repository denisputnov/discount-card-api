const Router = require('express');
const appController = require('../controllers/app.controller');
const router = Router()

router.post('/login', appController.login )
router.post('/confirmlogin', appController.confirmLogin)
router.post('/registration', appController.registration)
router.post('/generatecode', appController.generateCodeForRegistration)
router.get('/data', appController.getData)


module.exports = router 