
function enableSubmitBtn(){
    let btn = document.getElementById('btnSubmit').disabled = false    
}

async function submitInvoice(formData){

    const spinner = document.getElementById('loadingSpinnerBtnSubmit')
    spinner.classList.remove('hidden')

    try{        

        // submit the invoice data to the server
        const baseUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:5000/invoice/submit' // Development URL
            : 'https://invoice-generator-api-5far.onrender.com/invoice/submit'; // Production URL

        const response = await fetch(baseUrl, {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                ...formData            
            })
        })

        const submissionResponse = await response.json()
        console.log(submissionResponse)


        spinner.classList.add('hidden')    

    }catch(err){
        spinner.classList.add('hidden')    
        console.log("Error submitting invoice: ", err)
    }    

}


async function generateInvoice(formData){

    //loading spinner
    const spinner = document.getElementById('loadingSpinnerBtnDemo')
    spinner.classList.remove('hidden')

    try{       


        const baseUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:5000/generate-pdf' // Development URL
            : 'https://invoice-generator-api-5far.onrender.com/generate-pdf'; // Production URL

        const response = await fetch(baseUrl, {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(formData)
        })

        const pdfData = await response.json()

        spinner.classList.add('hidden')
        showPDF(pdfData.dataUrl)
        // console.log(pdfData)

    }catch(err){
        spinner.classList.add('hidden')
        console.log("Error generating pdf: ", err)
    }
    
}

async function showPDF(dataUrl){
    const pdfContainer = document.querySelector('.pdf-container')
    let child = document.querySelector('#pdf-iframe')    
    pdfContainer.removeChild(child)
    

    let pdfIframe = document.createElement('iframe')
    pdfIframe.id = 'pdf-iframe'
    pdfIframe.src = dataUrl
    pdfIframe.height = pdfContainer.offsetHeight - 32
    pdfIframe.width = pdfContainer.offsetWidth - 32

    console.log(pdfIframe.height)
    console.log(pdfIframe.width)
    // console.log(pdfIframe)
    // console.log(pdfContainer)

    pdfContainer.appendChild(pdfIframe)
}


function getTableData(){
    const tableLineItems = document.querySelectorAll('#tableLineItems tbody tr');
    console.log(tableLineItems)
    
    let tableData = []
    tableLineItems.forEach((elm,ind)=>{
        let quantity = elm.querySelector('.quantity').value
        let item = elm.querySelector('.item').value
        let description = elm.querySelector('.description').value
        let unitPrice = elm.querySelector('.unitPrice').value

        let tempRow = {
            "quantity":quantity,
            "item":item,
            "description":description,
            "unitPrice":unitPrice
        }

        console.log(tableData)
        tableData.push(tempRow)
    })

    return tableData
}


document.querySelector('#btnDemo').addEventListener('click', async ()=>{
    let template = document.querySelector('#template').value

    let formBusinessDetails = document.querySelector('#formBusinessDetails')
    let formData_businessDetails = new FormData(formBusinessDetails)
    let businessDetails = {}
    for(const [key, value] of formData_businessDetails.entries()){
        businessDetails[key] = value
    }

    let invoiceNumber = document.querySelector('#invoiceNumber').value
    let invoiceDate = document.querySelector('#invoiceDate').value
    let invoiceDueDate = document.querySelector('#invoiceDueDate').value
    let tableData = getTableData()
    let subtotal = document.querySelector('#subtotal').value
    let taxes = document.querySelector('#taxes').value
    let fees = document.querySelector('#fees').value
    let total = document.querySelector('#total').value
    
    let formData = {
        "template": template,
        "data": {
            "businessDetails": businessDetails,
            "invoiceNumber": invoiceNumber,
            "invoiceDate": invoiceDate,
            "invoiceDueDate": invoiceDate,
            "table": tableData,
            "subtotal": subtotal,
            "taxes": taxes,
            "fees": fees,
            "total": total
        }
    }

    generateInvoice(formData)

    enableSubmitBtn()

})

document.querySelector('#btnSubmit').addEventListener('click', async ()=>{    
    
    // get business form data (not submitted rn)
    let formBusinessDetails = document.querySelector('#formBusinessDetails')
    let formData_businessDetails = new FormData(formBusinessDetails)
    let businessDetails = {}
    for(const [key, value] of formData_businessDetails.entries()){
        businessDetails[key] = value
    }

    // get invoice data 
    let invoiceNumber = document.querySelector('#invoiceNumber').value
    let invoiceDate = document.querySelector('#invoiceDate').value
    let invoiceDueDate = document.querySelector('#invoiceDueDate').value
    let tableData = getTableData()
    let subtotal = document.querySelector('#subtotal').value
    let taxes = document.querySelector('#taxes').value
    let fees = document.querySelector('#fees').value
    let total = document.querySelector('#total').value
    let pdfData = document.querySelector('#pdf-iframe').src
    
    let formData = {   
        "pdfData": pdfData,     
        "businessDetails": businessDetails,
        "invoiceNumber": invoiceNumber,
        "invoiceDate": invoiceDate,
        "invoiceDueDate": invoiceDate,
        "table": tableData,
        "subtotal": subtotal,
        "taxes": taxes,
        "fees": fees,
        "total": total        
    }

    // const pdfResponse = await generateInvoice(formData)
    submitInvoice(formData)

    
})
