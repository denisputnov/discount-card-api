class CardDTO {
  constructor(card) {
    this.name = card.name
    this.phone = card.phone
    this.card_number = card.card_number
    this.score = card.score
    this.discount_percent = card.discount_percent
  } 
}

module.exports = CardDTO