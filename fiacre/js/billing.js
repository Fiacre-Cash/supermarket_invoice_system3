let currentInvoice = {
    invoiceNumber: '',
    items: [],
    subtotal: 0,
    vat: 0,
    discount: 0,
    grandTotal: 0
};

let products = [];

function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV${year}${month}${day}${random}`;
}

function loadProductsForBilling() {
    products = JSON.parse(localStorage.getItem('products') || '[]');
    const productSelect = document.getElementById('productSelect');
    
    productSelect.innerHTML = '<option value="">Select a product</option>';
    
    products.filter(p => p.quantity > 0).forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} - ${product.price} RWF (Stock: ${product.quantity})`;
        productSelect.appendChild(option);
    });
}

function updateStockInfo() {
    const productId = document.getElementById('productSelect').value;
    const quantity = parseInt(document.getElementById('itemQuantity').value) || 0;
    const stockInfo = document.getElementById('stockInfo');
    
    if (!productId) {
        stockInfo.innerHTML = '';
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (quantity > product.quantity) {
        stockInfo.innerHTML = `Not enough stock. Available: ${product.quantity}`;
        stockInfo.className = 'stock-info error';
    } else if (quantity > 0) {
        stockInfo.innerHTML = `Available stock: ${product.quantity}`;
        stockInfo.className = 'stock-info success';
    } else {
        stockInfo.innerHTML = '';
    }
}

function addItemToInvoice(productId, quantity) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        alert('Product not found');
        return false;
    }
    
    if (quantity > product.quantity) {
        alert(`Not enough stock. Available: ${product.quantity}`);
        return false;
    }
    
    const existingItem = currentInvoice.items.find(item => item.productId === productId);
    
    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.quantity) {
            alert(`Not enough stock. Available: ${product.quantity}`);
            return false;
        }
        existingItem.quantity = newQuantity;
        existingItem.total = existingItem.quantity * existingItem.price;
    } else {
        currentInvoice.items.push({
            productId: product.id,
            name: product.name,
            price: parseFloat(product.price),
            quantity: quantity,
            total: parseFloat(product.price) * quantity
        });
    }
    
    return true;
}

function removeItemFromInvoice(productId) {
    currentInvoice.items = currentInvoice.items.filter(item => item.productId !== productId);
    renderInvoiceItems();
    calculateTotals();
}

function renderInvoiceItems() {
    const tbody = document.getElementById('itemsTableBody');
    
    if (currentInvoice.items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No items added</td></tr>';
        return;
    }
    
    tbody.innerHTML = currentInvoice.items.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.price.toLocaleString()} RWF</td>
            <td>${item.quantity}</td>
            <td>${item.total.toLocaleString()} RWF</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="removeItemFromInvoice('${item.productId}')">Remove</button>
            </td>
        </tr>
    `).join('');
}

function calculateTotals() {
    currentInvoice.subtotal = currentInvoice.items.reduce((sum, item) => sum + item.total, 0);
    currentInvoice.vat = currentInvoice.subtotal * 0.18;
    currentInvoice.discount = parseFloat(document.getElementById('discount').value) || 0;
    currentInvoice.grandTotal = currentInvoice.subtotal + currentInvoice.vat - currentInvoice.discount;
    
    document.getElementById('subtotal').textContent = currentInvoice.subtotal.toFixed(2) + ' RWF';
    document.getElementById('vat').textContent = currentInvoice.vat.toFixed(2) + ' RWF';
    document.getElementById('grandTotal').textContent = currentInvoice.grandTotal.toFixed(2) + ' RWF';
}

function completeInvoice() {
    if (currentInvoice.items.length === 0) {
        alert('Please add at least one item to the invoice');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    const invoice = {
        invoiceNumber: currentInvoice.invoiceNumber,
        date: new Date().toISOString(),
        cashier: currentUser.username,
        cashierName: currentUser.fullName,
        items: currentInvoice.items,
        subtotal: currentInvoice.subtotal,
        vat: currentInvoice.vat,
        discount: currentInvoice.discount,
        grandTotal: currentInvoice.grandTotal
    };
    
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    invoices.push(invoice);
    localStorage.setItem('invoices', JSON.stringify(invoices));
    
    updateProductStock();
    
    localStorage.setItem('currentInvoice', JSON.stringify(invoice));
    
    window.location.href = 'invoice.html';
}

function updateProductStock() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    currentInvoice.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            product.quantity -= item.quantity;
        }
    });
    
    localStorage.setItem('products', JSON.stringify(products));
}

document.getElementById('productSelect')?.addEventListener('change', updateStockInfo);
document.getElementById('itemQuantity')?.addEventListener('input', updateStockInfo);
document.getElementById('discount')?.addEventListener('input', calculateTotals);

document.getElementById('addItemForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const productId = document.getElementById('productSelect').value;
    const quantity = parseInt(document.getElementById('itemQuantity').value);
    
    if (!productId) {
        alert('Please select a product');
        return;
    }
    
    if (!quantity || quantity < 1) {
        alert('Please enter a valid quantity');
        return;
    }
    
    if (addItemToInvoice(productId, quantity)) {
        renderInvoiceItems();
        calculateTotals();
        document.getElementById('addItemForm').reset();
        document.getElementById('stockInfo').innerHTML = '';
        loadProductsForBilling();
    }
});

if (document.getElementById('invoiceNumber')) {
    currentInvoice.invoiceNumber = generateInvoiceNumber();
    document.getElementById('invoiceNumber').textContent = currentInvoice.invoiceNumber;
    loadProductsForBilling();
}
