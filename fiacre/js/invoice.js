function loadInvoice() {
    const invoice = JSON.parse(localStorage.getItem('currentInvoice'));
    
    if (!invoice) {
        alert('No invoice found');
        window.location.href = 'dashboard.html';
        return;
    }
    
    document.getElementById('invoiceNumber').textContent = invoice.invoiceNumber;
    
    const date = new Date(invoice.date);
    const dateStr = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const timeStr = date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    document.getElementById('invoiceDate').textContent = `${dateStr} at ${timeStr}`;
    document.getElementById('cashierName').textContent = invoice.cashierName;
    
    const tbody = document.getElementById('invoiceItemsBody');
    tbody.innerHTML = invoice.items.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.price.toLocaleString()} RWF</td>
            <td>${item.quantity}</td>
            <td>${item.total.toLocaleString()} RWF</td>
        </tr>
    `).join('');
    
    document.getElementById('invoiceSubtotal').textContent = invoice.subtotal.toFixed(2) + ' RWF';
    document.getElementById('invoiceVat').textContent = invoice.vat.toFixed(2) + ' RWF';
    document.getElementById('invoiceDiscount').textContent = invoice.discount.toFixed(2) + ' RWF';
    document.getElementById('invoiceGrandTotal').textContent = invoice.grandTotal.toFixed(2) + ' RWF';
}

function goBack() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser.role === 'admin') {
        window.location.href = 'sales.html';
    } else {
        window.location.href = 'dashboard.html';
    }
}

if (document.getElementById('invoiceNumber')) {
    loadInvoice();
}
