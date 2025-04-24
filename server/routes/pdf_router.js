const express = require('express')
const puppeteer = require('puppeteer')
const nunjucks = require('nunjucks')
const fs = require('fs-extra')
const path = require('path')
require('dotenv').config()

const router = express.Router()
nunjucks.configure(path.join('..','templates'), {
    autoescape: true,
    express: express(),
    watch: true
});

// helper functions
async function getHtmlString(template, data){    
    const filePath = path.join(__dirname, "..", "templates", `${template}.html`)
    const njk_template = await fs.readFile(filePath, 'utf-8')    
    const rendered_string = nunjucks.renderString(njk_template, {"data":data})

    // console.log(rendered_string)
    // console.log(njk_template)
    // console.log(nunjucks.renderString(njk_template,data))
    return rendered_string 
}



// routes
// router.get('/',(req,res)=>{
//     res.send({"message":"hello world"})
// })

router.post('/generate-pdf', async (req,res)=>{
    try{
        const browser = await puppeteer.launch({
            args: [
                "--disable-setuid-sandbox",
                "--no-sandbox",
                "--single-process",
                "--no-zygote"
            ],
            executablePath: process.env.NODE_ENV == 'production' ?
            process.env.PUPPETEER_EXECUTABLE_PATH :
            puppeteer.executablePath()
        })     
        const page = await browser.newPage()

        const template = req.body.template // filename (no .html)
        const data = req.body.data // json data for the njk template
        const htmlString = await getHtmlString(template,data)
        
        await page.setContent(htmlString)
        await page.emulateMediaType('screen')
        const pdfData = await page.pdf({
            // path: './output files/test.pdf',
            format: 'A4',
            printBackground: true
        })

        const bufferArr = await Buffer.from(pdfData, "utf-8")
        const base64String = await bufferArr.toString("base64")
        const dataUrl = `data:application/pdf;base64,${base64String}`
        
        
        console.log('Generated PDF ')
        await browser.close()

        res.send({"type":"application/pdf","data":base64String,"dataUrl":dataUrl})        

    }catch(err){
        console.log(err)
        res.send(err)
    }
    
})

router.post('/compile-test', async(req,res)=>{
    const template = req.body.template // filename (no .html)
    const data = req.body.data // json data for the njk template
    const htmlString = await getHtmlString(template,data)

    res.send({"html":htmlString})
})

module.exports = router