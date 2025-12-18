function loadSalesHistory() {
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    
    if (invoices.length === 0) {
        document.getElementById('salesTableBody').innerHTML = 
            '<tr><td colspan="7" class="text-center text-muted">No sales records found</td></tr>';
        updateSalesStats(invoices);
        return;
    }
    
    const sortedInvoices = invoices.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const tbody = document.getElementById('salesTableBody');
    tbody.innerHTML = sortedInvoices.map(invoice => {
        const date = new Date(invoice.date);
        const dateStr = date.toLocaleDateString('en-US');
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        return `
            <tr>
                <td>${invoice.invoiceNumber}</td>
                <td>${dateStr}</td>
                <td>${timeStr}</td>
                <td>${invoice.cashierName || invoice.cashier}</td>
                <td>${invoice.items.length}</td>
                <td>${invoice.grandTotal.toLocaleString()}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="viewInvoiceDetails('${invoice.invoiceNumber}')">View</button>
                </td>
            </tr>
        `;
    }).join('');
    
    updateSalesStats(invoices);
}

function updateSalesStats(invoices) {
    document.getElementById('totalInvoices').textContent = invoices.length;
    
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
    document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString() + ' RWF';
    
    const averageSale = invoices.length > 0 ? totalRevenue / invoices.length : 0;
    document.getElementById('averageSale').textContent = averageSale.toFixed(2).toLocaleString() + ' RWF';
    
    const totalVat = invoices.reduce((sum, inv) => sum + (inv.vat || 0), 0);
    document.getElementById('totalVat').textContent = totalVat.toFixed(2).toLocaleString() + ' RWF';
}

function viewInvoiceDetails(invoiceNumber) {
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const invoice = invoices.find(inv => inv.invoiceNumber === invoiceNumber);
    
    if (invoice) {
        localStorage.setItem('currentInvoice', JSON.stringify(invoice));
        window.location.href = 'invoice.html';
    }
}

// Enhanced functions for sales reports
function filterSalesData(period, customFilters = null) {
    // This function would filter sales data based on period and custom filters
    console.log('Filtering sales data for period:', period, 'with filters:', customFilters);
    
    // For now, we'll just reload all data
    loadSalesHistory();
}

function exportSalesReport(format = 'pdf') {
    // This function would export sales data in the specified format
    console.log('Exporting sales report in format:', format);
    
    // Show a message to the user
    alert(`Exporting sales report as ${format.toUpperCase()}...`);
}

if (document.getElementById('salesTable')) {
    loadSalesHistory();
}
