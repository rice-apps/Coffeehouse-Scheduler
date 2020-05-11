var mongoose     = require('mongoose')
    , Schema       = mongoose.Schema
require('../db')

var User = require('./usersModel').user;

// New Schedule Model

var ShiftPreferenceSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: User },
  preference: Number,
  // preference: { type: Number, enum: [1, 2, 3, 4] },
  scheduled: Boolean
});

var ShiftSchema = new Schema({
  term: String,
  day: { type: String, enum: ['M', 'T', 'W', 'R', 'F', 'S', 'U'] },
  hour: { type: Number }, 
  preferences: [ ShiftPreferenceSchema ]
});

var Shift = mongoose.model("shifts", ShiftSchema)

exports.shift = Shift
