function getDateNow() {
  const date = new Date()
  const month = date.getMonth() + 1
  return `${date.getDate()}${month.toString().length === 1 ? `0${month}` : month }${date.getFullYear()}` 
} 

module.exports = getDateNow