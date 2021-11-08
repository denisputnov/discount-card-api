const Router = require('express');
const cardController = require('../controllers/card.controller');
const router = Router()

router.get('/', cardController.getOneCard)
router.get('/all', cardController.getCards)
router.put('/:id', cardController.updateCard)
router.post('/register', cardController.registerCard)
router.delete('/:id', cardController.deleteCardById)

module.exports = router 