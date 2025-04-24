const mongoose = require('mongoose')
const {Schema, model} = mongoose

const invoiceSchema = new Schema({
    invoiceDate: String,
    invoiceDueDate: String,
    invoiceNumber: String,
    invoiceAmount: Number,
    customerName: String,
    pdfData: String,
})


module.exports = model('Invoice', invoiceSchema)