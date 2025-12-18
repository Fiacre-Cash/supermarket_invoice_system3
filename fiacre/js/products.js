let products = [];
let editingProductId = null;

function loadProducts() {
    products = JSON.parse(localStorage.getItem('products') || '[]');
    renderProductsTable();
}

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function generateProductId() {
    return 'PROD' + Date.now() + Math.floor(Math.random() * 1000);
}

function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No products available</td></tr>';
        return;
    }
    
    tbody.innerHTML = products.map(product => {
        let statusBadge = '';
        if (product.quantity === 0) {
            statusBadge = '<span class="badge badge-danger">Out of Stock</span>';
        } else if (product.quantity < 10) {
            statusBadge = '<span class="badge badge-warning">Low Stock</span>';
        } else {
            statusBadge = '<span class="badge badge-success">In Stock</span>';
        }
        
        return `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${parseFloat(product.price).toLocaleString()}</td>
                <td>${product.quantity}</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-primary btn-sm" onclick="editProduct('${product.id}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function showAddProductModal() {
    editingProductId = null;
    document.getElementById('modalTitle').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModal').classList.add('active');
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    editingProductId = id;
    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productQuantity').value = product.quantity;
    document.getElementById('productModal').classList.add('active');
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        renderProductsTable();
    }
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    editingProductId = null;
}

document.getElementById('productForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const quantity = parseInt(document.getElementById('productQuantity').value);
    
    if (!name || price < 0 || quantity < 0) {
        alert('Please enter valid product information');
        return;
    }
    
    if (editingProductId) {
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                price,
                quantity
            };
        }
    } else {
        const newProduct = {
            id: generateProductId(),
            name,
            price,
            quantity
        };
        products.push(newProduct);
    }
    
    saveProducts();
    renderProductsTable();
    closeProductModal();
});

window.onclick = (event) => {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeProductModal();
    }
};

if (document.getElementById('productsTable')) {
    loadProducts();
}
