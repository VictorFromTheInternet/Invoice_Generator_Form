const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/',(req,res)=>{
    // const filePath = path.join(__dirname, "....", "frontend","public", "views", `index.html`)
    const filePath = path.join(__dirname, "..","..","frontend", "public","views","index.html")    
    res.sendFile(filePath)
})

router.get('/demo',(req,res)=>{
    // const filePath = path.join(__dirname, "....", "frontend","public", "views", `index.html`)
    const filePath = path.join(__dirname, "..", "public","views","index.html")    
    res.sendFile(filePath)
})


module.exports = router