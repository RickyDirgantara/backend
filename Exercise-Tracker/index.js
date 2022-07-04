const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()
const cors = require('cors')
const mongodb = require("mongodb")
const mongoose = require('mongoose')
let uri = 'mongodb+srv://user:r2CmtjeAulV4lgYe@ricky.c1gyy.mongodb.net/db1?retryWrites=true&w=majority'
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });



app.use(cors())

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})



const userExercisesSchema = mongoose.Schema({
  username: {type: String, required: true},

  log: [{
    description: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  }]
})

const User = mongoose.model("User", userExercisesSchema);

app.post('/api/users', bodyParser.urlencoded({ extended: false }), (request, response) => {
  User.findOne({username: request.body.username}, (err, doc)=>{
    if (doc) {
      response.json({
        userame: doc.username,
        _id: doc._id
      })
    } else {
      User.create({
        username: request.body.username,
        log: []
      })
        .then(savedDoc=>{
        response.json({
          username: savedDoc.username,
          _id: savedDoc._id
        })
      })
    }
  })
})

app.get('/api/users', (request, response) => {
 User.find({}, (error, docs)=>{
    response.json(docs);
  })
  .select({username: 1, _id: 1})
})

app.post('/api/users/:id/exercises/', bodyParser.urlencoded({ extended: false }) , (request, response) => {
  
// Access document related to input id.
  User.findById(request.params.id, (err, doc)=>{
    if (doc) {
      doc.log.push({
        description: request.body.description,
        duration: request.body.duration,
        date: new Date(request.body.date).toDateString() != "Invalid Date" ? new Date(request.body.date) : new Date()
      })

      doc.save().catch(err=>{console.log("DOCSAVE ERR ", err)});

      // The anomalous code:
      // Changes:
      // Used _id of both user & exercise.
      // Tried parseInt(req.body.duration)
      response.json({
        _id: doc._id,
        username: doc.username,
        description: request.body.description,
        duration: parseInt(request.body.duration),
        date: new Date(request.body.date).toDateString() != "Invalid Date" ? new Date(request.body.date).toDateString() : new Date().toDateString()
      })
    }
  })
})

app.get("/api/users/:id/logs", (req, res)=>{

  User.findById(req.params.id, (err, doc)=>{
    if (doc) {
      res.json({
        username: doc.username,
        count: doc.log.length,
        _id: doc._id,
        log: doc.log.sort((exerciseA, exerciseB)=>{return exerciseA.date-exerciseB.date})

        .filter((exercise)=>{
          let fromDate = new Date(req.query.from);
          let toDate = new Date(req.query.to);

          if (fromDate.toDateString() !== "Invalid Date" && toDate.toDateString() !== "Invalid Date") {
           return exercise.date >= fromDate && exercise.date <= toDate
          } else if (fromDate.toDateString() !== "Invalid Date") {
            return exercise.date >= fromDate;
          } else if (toDate.toDateString() !== "Invalid Date") {
            return exercise.date <= toDate;
          } else if (fromDate.toDateString() == "Invalid Date" && toDate.toDateString() == "Invalid Date") {
            return true;
          }
        })
        .slice(0, parseInt(req.query.limit) ? parseInt(req.query.limit) : doc.log.length)
        .map((exercise, index)=>{
          return {
            description: exercise.description,
            duration: exercise.duration,
            date: exercise.date.toDateString(),
            _id: exercise._id
          }
        })
      })
      }
    }
  })
