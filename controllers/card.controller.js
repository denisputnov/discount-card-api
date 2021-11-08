const db = require('../db')
const getDateNow = require('../helpers/date.helper')

class CardController {
  constructor() {
    this.getOneCard = this.getOneCard.bind(this)
  }
  // gets all fields
  async registerCard(req, res) {
    try {
      const {
        card_number, 
        name, 
        phone, 
        discount_level, 
        gave, 
        reason, 
        score } = req.body

      if (!card_number || !name || !gave || !reason) {
        res.json({error: "There are no required fields in request body. Required fields: card_number, name, gave, reason"})
      }

      const newCard = await db.query('INSERT INTO cards (card_number, name, phone, discount_level, gave, reason, date, score) values ($1, $2, $3, COALESCE($4, 0), $5, $6, $7, COALESCE($8, 0.00)) RETURNING *', [card_number, name, phone, discount_level, gave, reason, getDateNow(), score])
      
      res.json(newCard.rows[0])
    } catch (error) {
      res.status(500).json({error})
    }
  }
  // returns db
  async getCards(req, res) {
    try {
      const base = await db.query('SELECT * FROM cards LEFT JOIN (SELECT discount_percent, discount_level FROM discounts) AS temp ON cards.discount_level = temp.discount_level')
      res.json(base.rows)
    } catch (error) {
      res.status(500).json({error})
    }
  }
  // returns user by phone, name or card number
  async getOneCard(req, res) {
    try {
      const { phone, name, card_number } = req.query
      
      if (!phone && !name && !card_number) {
        req.json({error: "There are no search query fiels in request body. System can search users by phone, name or card number"})
      }

      if (phone) {
        const card = await this.getOneCardByPhone(decodeURI(phone))
        return res.json(card.rows)
      } 
      if (name) {
        const card = await this.getOneCardByName(decoreURI(name))
        return res.json(card.rows)
      } 
      if (card_number) {
        const card = await this.getOneCardByCardNumber(decodeURI(card_number))
        return res.json(card.rows)
      } 
    } catch (error) {
      res.status(500).json({error})
    }
  }
  async getOneCardByPhone(phone) {
    return await db.query("SELECT * FROM cards LEFT JOIN (SELECT discount_percent, discount_level FROM discounts) AS temp ON cards.discount_level = temp.discount_level WHERE phone LIKE $1", [`%${phone}%`])
  }
  async getOneCardByName(name) {
    return await db.query("SELECT * FROM cards LEFT JOIN (SELECT discount_percent, discount_level FROM discounts) AS temp ON cards.discount_level = temp.discount_level WHERE name LIKE $1", [`%${name}%`])
  }
  async getOneCardByCardNumber(card_number) {
    return await db.query("SELECT * FROM cards LEFT JOIN (SELECT discount_percent, discount_level FROM discounts) AS temp ON cards.discount_level = temp.discount_level WHERE card_number LIKE $1", [`%${card_number}%`])
  }
  // update customer fields by card number
  async updateCard(req, res) {
    try {
      const id = req.params.id

      if (!id) {
        res.json({error: "There is no card id in url"})
      }

      const {
        card_number, 
        name, 
        phone, 
        discount_level, 
        gave, 
        reason, 
        score } = req.body

      const card = await db.query("UPDATE cards set card_number = COALESCE($1, cards.card_number), name = COALESCE($2, cards.name), phone = COALESCE($3, cards.phone), discount_level = COALESCE($4, cards.discount_level), gave = COALESCE($5, cards.gave), reason = COALESCE($6, cards.reason), score = COALESCE($7, cards.score) where id = $8 RETURNING *", [card_number, name, phone, discount_level, gave, reason, score, id])

      res.json(card.rows[0])
    } catch (error) {
      res.status(500).json({error})
    }
  }
  // delete customer from db
  async deleteCardById(req, res) {
    try {
      const id = req.params.id

      if (!id) {
        res.json({error: "There is no card id in url"})
      }

      const card = await db.query("DELETE FROM cards WHERE id = $1 RETURNING *", [id])

      res.json(card.rows[0])
    } catch (error) {
      res.status(500).json({error})
    }
  }
}

module.exports = new CardController()