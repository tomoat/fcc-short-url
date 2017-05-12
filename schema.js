const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CounterSchema = Schema({
    _id: {type: String, required: true },
    seq: {type: Number, default: 0 }
})

const counters = mongoose.model('counters', CounterSchema)

const UrlSchema = new Schema({
    id: { type: Number, default: 0 },
    url: String
})

UrlSchema.pre('save', (next) => {
    const doc = this
    counters.findByIdAndUpdate({_id: 'urlid'}, {$inc: {seq: 1}}, (err, counters) => {
        if(err) {
            return next(err)
        }
        doc.id = counters.seq
        next()
    })
})

module.exports = mongoose.model('UrlList', UrlSchema)