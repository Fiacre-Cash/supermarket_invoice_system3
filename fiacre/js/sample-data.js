// Sample data for testing the supermarket invoice system

function addSampleData() {
    // Sample products
    const sampleProducts = [
        {
            id: 'prod_' + (Date.now() + 1),
            name: 'Apple iPhone 15 Pro',
            price: 1200000,
            quantity: 15
        },
        {
            id: 'prod_' + (Date.now() + 2),
            name: 'Samsung Galaxy S24 Ultra',
            price: 1100000,
            quantity: 12
        },
        {
            id: 'prod_' + (Date.now() + 3),
            name: 'MacBook Air M2',
            price: 1800000,
            quantity: 8
        },
        {
            id: 'prod_' + (Date.now() + 4),
            name: 'Dell XPS 13 Laptop',
            price: 1500000,
            quantity: 10
        },
        {
            id: 'prod_' + (Date.now() + 5),
            name: 'Sony WH-1000XM5 Headphones',
            price: 350000,
            quantity: 25
        },
        {
            id: 'prod_' + (Date.now() + 6),
            name: 'Nike Air Max 270',
            price: 120000,
            quantity: 30
        },
        {
            id: 'prod_' + (Date.now() + 7),
            name: 'Adidas Ultraboost 22',
            price: 135000,
            quantity: 28
        },
        {
            id: 'prod_' + (Date.now() + 8),
            name: 'Rolex Submariner Watch',
            price: 5000000,
            quantity: 5
        }
    ];

    // Sample users (admin and cashier)
    const sampleUsers = [
        {
            username: 'admin',
            password: 'admin123',
            fullName: 'System Administrator',
            role: 'admin'
        },
        {
            username: 'cashier1',
            password: 'cashier123',
            fullName: 'John Cashier',
            role: 'cashier'
        },
        {
            username: 'cashier2',
            password: 'cashier456',
            fullName: 'Jane Smith',
            role: 'cashier'
        }
    ];

    // Save sample products to localStorage
    localStorage.setItem('products', JSON.stringify(sampleProducts));
    
    // Save sample users to localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const allUsers = [...existingUsers, ...sampleUsers];
    localStorage.setItem('users', JSON.stringify(allUsers));
    
    console.log('Sample data added successfully!');
    console.log('Products:', sampleProducts.length);
    console.log('Users:', allUsers.length);
    
    // Show success message
    if (typeof showAlert !== 'undefined') {
        showAlert('Sample data added successfully! You can now test the billing system.', 'success');
    } else {
        alert('Sample data added successfully! You can now test the billing system.');
    }
}

// Function to generate sample invoices for testing
function generateSampleInvoices(count = 5) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const cashiers = JSON.parse(localStorage.getItem('users') || '[]').filter(u => u.role === 'cashier');
    
    if (products.length === 0 || cashiers.length === 0) {
        console.log('Please add sample data first!');
        if (typeof showAlert !== 'undefined') {
            showAlert('Please add sample data first! Run addSampleData()', 'error');
        } else {
            alert('Please add sample data first! Run addSampleData()');
        }
        return;
    }
    
    const invoices = [];
    
    for (let i = 0; i < count; i++) {
        // Randomly select 1-4 products for this invoice
        const itemCount = Math.floor(Math.random() * 4) + 1;
        const selectedProducts = [];
        
        for (let j = 0; j < itemCount; j++) {
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            
            // Check if product already selected
            const existing = selectedProducts.find(p => p.productId === randomProduct.id);
            if (existing) {
                existing.quantity += quantity;
                existing.total = existing.quantity * existing.price;
            } else {
                selectedProducts.push({
                    productId: randomProduct.id,
                    name: randomProduct.name,
                    price: randomProduct.price,
                    quantity: quantity,
                    total: randomProduct.price * quantity
                });
            }
        }
        
        // Calculate totals
        const subtotal = selectedProducts.reduce((sum, item) => sum + item.total, 0);
        const vat = subtotal * 0.18;
        const discount = Math.floor(Math.random() * 5000);
        const grandTotal = subtotal + vat - discount;
        
        // Random cashier
        const cashier = cashiers[Math.floor(Math.random() * cashiers.length)];
        
        // Sample client names
        const clientNames = ['Michael Johnson', 'Sarah Williams', 'Robert Brown', 'Emily Davis', 'David Wilson', 'Lisa Miller', 'James Taylor', 'Jennifer Anderson'];
        const clientName = clientNames[Math.floor(Math.random() * clientNames.length)] || 'Walk-in Customer';
        
        const invoice = {
            invoiceNumber: `INV${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(i + 1).padStart(4, '0')}`,
            date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
            cashier: cashier.username,
            cashierName: cashier.fullName,
            clientName: clientName,
            items: selectedProducts,
            subtotal: subtotal,
            vat: vat,
            discount: discount,
            grandTotal: grandTotal
        };
        
        invoices.push(invoice);
    }
    
    // Save to localStorage
    const existingInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const allInvoices = [...existingInvoices, ...invoices];
    localStorage.setItem('invoices', JSON.stringify(allInvoices));
    
    console.log(`${count} sample invoices generated successfully!`);
    console.log('Total invoices now:', allInvoices.length);
    
    // Show success message
    if (typeof showAlert !== 'undefined') {
        showAlert(`${count} sample invoices generated successfully!`, 'success');
    } else {
        alert(`${count} sample invoices generated successfully!`);
    }
    
    return invoices;
}

// Run this to add sample data
console.log('To add sample data, run: addSampleData()');
console.log('To generate sample invoices, run: generateSampleInvoices(5)');