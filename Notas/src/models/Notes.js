const mongoose = require('mongoose');

const {Schema} = mongoose;

const noteSchema = new Schema({
    title: {type: String, required: true},
    descripcion: {type: String, required: true},
    date: {type: Date, default: Date.now},
    user: { type: String}
})

module.exports = mongoose.model('Nota', noteSchema)