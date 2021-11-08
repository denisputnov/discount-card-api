const db = require('../db')
const CardDTO = require('../dtos/card.dto')
const smsService = require('../services/sms.service')
const cardController = require('./card.controller')
const getDateNow = require('../helpers/date.helper')

class AppController {
  async login(req, res) {
    try {
      const { phone } = req.query
      console.log('login back', phone);
      if (!phone) {
        return res.json({error: "There is no phone in request query"})
      } 

      const queryResult = await cardController.getOneCardByPhone(phone)
      const card = queryResult.rows[0]

      if (!card) {
        return res.json({error: `User with number ${phone} not found`})
      }

      const code = smsService.generateCodeForCustomer(phone)

      smsService.sendMessageWithCode(`7${phone}`, code)

      res.json('ok')
    } catch (error) {
      res.status(500).json({error})
    }
  }

  async confirmLogin(req, res) {
    try {
      const { phone, code } = req.query

      if (!phone || !code) {
        return res.json({error: "There are no phone and code in request query"})
      }
      
      const status = smsService.checkCode(phone, code)

      if (status) {
        return res.json({logged: true})
      }

      res.json({logged: false})
    } catch (error) {
      res.status(500).json({error})
    }
  } 
  
  async getData(req, res) {
    try {
      const { phone } = req.query

      if (!phone) {
        return res.json({error: "There is no phone in request query"})
      } 

      const card = await cardController.getOneCardByPhone(phone)

      if (card.rows.length) {
        const dto = new CardDTO(card.rows[0])
        return res.status(200).json(dto)
      }

      res.json('Not found')
    } catch (error) {
      res.status(500).json({error})
    } 
  }

  async registration(req, res) {
    try {
      const { name, surname, middlename, phone, code } = req.body

      if (!phone) {
        return res.json({error: "There is no phone in request body"})
      } 

      const candidate = await cardController.getOneCardByPhone(phone)
      if (candidate.rows.length > 1) {
        return res.json({error: `Card for user with number ${phone} is already exists`})
      }

      if (!code) {
        return res.json({error: "There is no code in request body"})
      } 

      const status = smsService.checkCode(phone, code.toString())
      console.log(code.toString(), status, phone)

      if (!status) {
        return res.json({error: "Wrong code"})
      }
      
      if (!name) {
        return res.json({error: "There is no name in request body"})
      } 

      if (!surname) {
        return res.json({error: "There is no surname in request body"})
      } 


      const maxCardNumber = await db.query('SELECT MAX(card_number) FROM cards')
      
      const cardNumber = maxCardNumber.rows[0].max + 1 < 100000 ? 100000 : maxCardNumber.rows[0].max + 1
      const nameForDB = middlename ? `${surname} ${name} ${middlename}` : `${surname} ${name}`
      const gave = "Мобильное приложение"
      const reason = "Регистрация"

      await db.query('INSERT INTO cards (card_number, name, phone, discount_level, gave, reason, date, score) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [cardNumber, nameForDB, phone, 0, gave, reason, getDateNow(), 0])

      res.status(200).json('ok')
    } catch(error) {
      res.status(500).json(error)
    }
  }

  async generateCodeForRegistration(req, res) {
    try {
      const { phone } = req.query

      if (!phone) {
        return res.json({error: "There is no phone in request query"})
      } 

      const candidate = await cardController.getOneCardByPhone(phone)

      if (candidate.rows.length > 0) {
        return res.json({error: `Card for user with number ${phone} is already exists`})
      }

      const code = smsService.generateCodeForCustomer(phone)

      smsService.sendMessageWithCode(`7${phone}`, code)

      res.status(200).json('ok')
    } catch(error) {
      res.status(500).json(error)
    }
  }
}

module.exports = new AppController()