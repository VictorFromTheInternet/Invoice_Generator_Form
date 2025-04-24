const fs = require('fs/promises');
const path = require('path');

const filePath = path.join(__dirname, "..", "logging", "logging.txt");

module.exports = async(req,res,next)=>{
    const timestamp = new Date().toLocaleString("en-US",{
        weekday: "short",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "CST",
        timeZoneName: "short"
    })
    const method = req.method;
    const url = req.url;
    const data = JSON.stringify(req.body)
    const log = `${timestamp}\n${method}\n${url}\n${data}\n\n`

    await fs.appendFile(filePath, log, (err)=>{
        if(err){
            console.log(err)
        }
    })
    next(); 
        
}
