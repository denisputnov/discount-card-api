const db = require('../db');

class DiscountController {
  // returns all db
  async getDiscounts(req, res) {
    try {
      const discounts = await db.query("SELECT * FROM discounts")
      res.json(discounts.rows)
    } catch (error) {
      res.status(500).json({error})
    }
  }
  // add new discount level. Gets level and discount percent
  async addDiscountLevel(req, res) {
    try {
      const { discount_level, discount_percent } = req.body

      if (!discount_level || !discount_percent) {
        res.json({error: "There are not all required field in request body. It must be { discount_level: int, discount_percent: int }"})
      }
      
      // is exists discount with discount_level fron req.body check
      const candidate = await db.query("SELECT * FROM discounts WHERE discount_level = $1", [discount_level])
      const isExists = !!candidate.rows.length
      // if level already exists
      if (isExists) {
        return res.json({error: `Discount with level ${discount_level} is already exists`})
      }

      const discount = await db.query("INSERT INTO discounts (discount_level, discount_percent) values($1, $2) RETURNING *", [discount_level, discount_percent])
      res.json(discount.rows[0])
    } catch (error) {
      res.status(500).json({error})
    }
  }
  // gets level and percent 
  async updateDiscountPercent(req, res) {
    try {
      const discount_level = req.params.level
    
      if (!discount_level) {
        return res.json({error: `Incorrect discount level ${discount_level}`})
      }

      const { discount_percent } = req.body 

      // if discount percent is incorrect
      if (!discount_percent || isNaN(parseInt(discount_percent))) {
        return res.json({error: `Incorrect discount percent in request body`})
      }

      const discount = await db.query("UPDATE discounts set discount_percent = $1 WHERE discount_level = $2 RETURNING *", [discount_percent, discount_level])
      res.json(discount.rows[0])
    } catch (error) {
      res.status(500).json({error})
    }
  }
  // gets discount level
  async deleteDiscountLevel(req, res) {
    try {
      const discount_level = req.params.level

      if (!discount_level) {
        return res.json({error: `Incorrect discount level ${discount_level}`})
      }

      const discount = await db.query("DELETE FROM discounts WHERE discount_level = $1 RETURNING *", [discount_level])
      res.json(discount.rows[0])
    } catch (error) {
      res.status(500).json({error})
    }
  }
  
}

module.exports = new DiscountController()
