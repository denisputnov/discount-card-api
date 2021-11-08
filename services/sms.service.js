const SMSru = require('sms_ru');


class SMSService {
  constructor(apikey) {
    this.smsManager = new SMSru(apikey)
    this.cache = {}
  }
  sendMessageWithCode(phone, code) {
    this.smsManager.sms_send({
      to: phone,
      text: `${code} - ваш код для входа`
    }, function(e) {
      console.log(e.description)
    })
  }

  generateCodeForCustomer(phone) {
    function randomIntFromInterval(min, max) {  
      return Math.floor(Math.random() * (max - min + 1) + min)
    } 

    this.cache[phone] = [0,0,0,0].map(() => randomIntFromInterval(1,9)).join('') 

    setTimeout(() => {
      delete this.cache[phone]
    }, 1000 * 300)

    console.log(this.cache)

    return this.cache[phone]
  }

  checkCode(phone, code) {
    if (this.cache[phone] && this.cache[phone] == code) {
      delete this.cache[phone]
      return true
    }
    return false
  }
  
}

const smsService = new SMSService("E1726073-1ACA-D4B5-C031-769D03662D89")

module.exports = smsService 