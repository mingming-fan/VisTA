var express = require('express')
var fileUpload = require('express-fileupload')

var app = express()

app.use(fileUpload())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.get('/video', function(req, res){
  var fileName = req.query.id
  res.sendFile(fileName, {root: __dirname})
})

app.post('/master', function(req, res) {
  console.log(req.body)
  res.send(req.body)
})

app.post('/study', function(req, res) {
  res.send('success')
})


app.listen(8080);
console.log('Listening on port 8080')
