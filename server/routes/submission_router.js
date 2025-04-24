const router = require('express').Router()
const invoiceModel = require('../models/invoice_model')



router.get('/', (req,res)=>{
    res.send({"message":"hello world"})
})

// get all for dashboard
router.get('/get-all-dash', async(req,res)=>{
    try{
        const fieldsToExclude = ['-pdfData', '-__v', '-createdAt', '-updatedAt'].join(' ')
        const submissionData = await invoiceModel.find().select(fieldsToExclude)
        if(!submissionData){
            return res.status(404).send({"message":"No submissions found"})
        }
        res.status(200).send(submissionData)

    }catch(err){
        console.error(err)
        res.status(500).send({"message":`Error fetching invoices: ${err}`})
    }
})


// get all invoices
router.get('/get-all', async(req,res)=>{
    try{
        const submissionData = await invoiceModel.find()
        if(!submissionData){
            return res.status(404).send({"message":"No submissions found"})
        }
        res.status(200).send(submissionData)

    }catch(err){
        console.error(err)
        res.status(500).send({"message":`Error fetching invoices: ${err}`})
    }
})

// find by _id
router.get('/get-by-id/:id', async(req,res)=>{
    try{
        const id = req.params.id
        const invoiceData = await invoiceModel.findOne({_id:id})
        if(!invoiceData){
            return res.status(404).send({"message":"Invoice not found"})
        }
        res.status(200).send(invoiceData)
    }catch(err){
        console.error(err)
        res.status(500).send({"message":`Error fetching invoice: ${err}`})
    }
})

// find by invoice number
router.get('/get-by-number/:invoiceNumber', async(req,res)=>{
    try{
        const invoiceNumber = req.params.invoiceNumber
        const invoiceData = await invoiceModel.findOne({invoiceNumber:invoiceNumber})
        if(!invoiceData){
            return res.status(404).send({"message":"Invoice not found"})
        }
        res.status(200).send(invoiceData)
    }catch(err){
        console.error(err)
        res.status(500).send({"message":`Error fetching invoice: ${err}`})
    }
})


// submit an invoice
router.post('/submit', async (req,res)=>{
    try{
        const invoiceData = {
            "invoiceDate": req.body.invoiceDate,
            "invoiceDueDate": req.body.invoiceDueDate,
            "invoiceNumber": req.body.invoiceNumber,
            "invoiceAmount": req.body.invoiceAmount,
            "customerName": req.body.customerName,
            "pdfData": req.body.pdfData}
        const newInvoice = new invoiceModel(invoiceData)        
        const document = await newInvoice.save()
        res.status(201).send({"message":"Invoice submitted successfully", "data":document})
    }catch(err){
        console.error(err)
        res.status(500).send({"message":`Error submitting invoice: ${err}`})
    }
})

// update and invoice
router.patch('/update/:id', async (req,res)=>{
    try{
        console.log()
        const id = req.params.id
        console.log(id)
        const invoiceData = {
            "invoiceDate": req.body.invoiceDate,
            "invoiceDueDate": req.body.invoiceDueDate,
            "invoiceNumber": req.body.invoiceNumber,
            "invoiceAmount": req.body.invoiceAmount,
            "customerName": req.body.customerName,
            "pdfData": req.body.pdfData}

        // update        
        const updatedDoc = await invoiceModel.findByIdAndUpdate(
            id, 
            invoiceData, 
            {new:true}) // returns the modified doc
        

        if(!updatedDoc){
            return res.status(404).send({"message": "Submission not found"})
        }  

        res.status(200).send({"message":`Invoice Updated successfully`, "document": updatedDoc})
        

    }catch(err){
        console.error(err)
        res.status(500).send({"message":`Error updating invoice: ${err}`})
    }
})

// delete an invoice
router.delete('/delete/:id', async(req,res)=>{
    try{
        const id = req.params.id
        await invoiceModel.findByIdAndDelete(id)
        res.status(204).send({"message":"Invoice deleted"})

        // if(!deletedDoc){
        //     console.error("Invoice not found")
        //     res.status(404).send({"message":"Invoice not found"})
        // }

    }catch(err){
        console.error(err)
        res.status(500).send({"message":`Error deleting invoice: ${err}`})
    }
})

module.exports = router