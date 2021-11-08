const Router = require('express');
const discountController = require('../controllers/discount.controller');
const router = Router()

router.get('/', discountController.getDiscounts)
router.post('/', discountController.addDiscountLevel)
router.put('/:level', discountController.updateDiscountPercent)
router.delete('/:level', discountController.deleteDiscountLevel)

module.exports = router 