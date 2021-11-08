const express = require('express');
const cardRouter = require('./routes/card.routes')
const discountRouter = require('./routes/discount.routes');
const appRouter = require('./routes/app.routes');
const smsService = require('./services/sms.service');
const PORT = process.env.PORT || 8080

const app = express()

app.use(express.json())
app.use('/api/card', cardRouter)
app.use('/api/discount', discountRouter)
app.use('/api/app', appRouter)

app.listen(PORT, () => {
  console.log(`Server has been started on port ${PORT}`)
})