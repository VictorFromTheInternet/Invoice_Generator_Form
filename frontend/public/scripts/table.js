
const tableLineItems = document.querySelector('#tableLineItems');

function addRow(){
    // create row
    let row = document.createElement('tr')

    row.innerHTML = 
    `
    <td><input class="quantity" type="number" value="0" min="0" required></td>
    <td><input class="item" type="text" placeholder="Name" required></td>
    <td><input class="description" type="text" placeholder="Lorem Ipsum ..." required></td>
    <td><input class="unitPrice" type="number" value="0" min="0" required></td>
    `

    // add row
    tableLineItems.querySelector('tbody').appendChild(row)
}

function removeRow(){
    // console.log(tableLineItems.querySelector('tbody tr:last-child'))
    let parent = tableLineItems.querySelector('tbody')
    let child = parent.querySelector('tr:last-child')
    parent.removeChild(child)
}

function calcTotals(){
    console.log('calc totals')
    let subtotal = document.querySelector('#subtotal')
    let fees = Number.parseFloat(document.querySelector('#fees').value)
    let taxes = Number.parseFloat(document.querySelector('#taxes').value)
    let total = document.querySelector('#total')

    // const tableLineItems = document.querySelectorAll('#tableLineItems tbody tr');
    // console.log(tableLineItems)
    // console.log(subtotal)
    
    // calc subtotal    
    let lineItems = document.querySelectorAll('#tableLineItems tbody tr .unitPrice')
    // console.log(lineItems)

    let sum = 0
    lineItems.forEach((elm,ind)=>{
        // console.log(elm.value)
        sum += Number.parseFloat(elm.value)
    })
    subtotal.value = sum

    // calc total
    total.value = sum + fees + taxes


}



document.getElementById('btnAddRow').addEventListener('click', ()=>{
    console.log('Add Row')
    addRow()
})

document.getElementById('btnRemoveRow').addEventListener('click', ()=>{
    console.log('Remove Row')
    removeRow()
})

document.getElementById('btnCalcTotals').addEventListener('click', ()=>{
    console.log('calc totals')
    console.log(calcTotals())
})


// validate the invoice line items before 
const form = document.getElementById('formTableLineItems');
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent default browser behavior
  
});
