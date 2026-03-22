/**
 * GEMINI SHOP - CORE SCRIPT
 * Quản lý: Hiển thị sản phẩm, Tìm kiếm, Giỏ hàng & Modal chi tiết
 */

const API_URL = 'https://fakestoreapi.com/products';
const shopContainer = document.getElementById('shop-container');
const searchInput = document.getElementById('search-input');
const cartCountBadge = document.getElementById('cart-count');
const modal = document.getElementById('product-modal');

let allProducts = []; 
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 1. Khởi tạo ứng dụng
async function initApp() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Không thể tải dữ liệu từ API");
        
        allProducts = await res.json();
        renderProducts(allProducts);
        updateCartBadge();
    } catch (error) {
        console.error("Lỗi:", error);
        if(shopContainer) shopContainer.innerHTML = `<p class="error">Lỗi kết nối: ${error.message}</p>`;
    }
}

// 2. Hiển thị danh sách sản phẩm (Trang chủ)
function renderProducts(data) {
    if (!shopContainer) return;
    shopContainer.innerHTML = '';

    data.forEach(p => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        // Chuẩn hóa tên sản phẩm để tránh lỗi cú pháp JavaScript khi truyền vào onclick
        const safeTitle = p.title.replace(/'/g, "\\'");

        card.innerHTML = `
            <div onclick="openProductModal(${p.id})" style="cursor:pointer">
                <span class="category">${p.category}</span>
                <img src="${p.image}" alt="${p.title}" loading="lazy">
                <h3>${p.title}</h3>
            </div>
            <div class="price-box">
                <p class="price">$${p.price.toFixed(2)}</p>
            </div>
            <button class="btn-buy" onclick="addToCart(${p.id}, '${safeTitle}', ${p.price}, '${p.image}')">
                <i class=""></i> Thêm vào giỏ hàng
            </button>
        `;
        shopContainer.appendChild(card);
    });
}

// 3. Logic Giỏ hàng & Kiểm tra đăng nhập
function addToCart(id, name, price, image) {
    // Kiểm tra Token đăng nhập trong LocalStorage
    const token = localStorage.getItem('userToken');

    if (!token) {
        alert("🔒 Bạn cần đăng nhập để thực hiện chức năng này!");
        window.location.href = 'auth.html';
        return;
    }

    // Xử lý thêm vào mảng giỏ hàng
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Lưu object đầy đủ thông tin (Quan trọng nhất là thuộc tính image)
        cart.push({ id, name, price, image, quantity: 1 });
    }

    // Lưu lại vào máy người dùng
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    
    
}

// Cập nhật số lượng hiển thị trên icon giỏ hàng
function updateCartBadge() {
    if (cartCountBadge) {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountBadge.innerText = total;
    }
}

// 4. Modal chi tiết sản phẩm
function openProductModal(id) {
    const p = allProducts.find(x => x.id === id);
    if (!p || !modal) return;

    document.getElementById('modal-img').src = p.image;
    document.getElementById('modal-title').innerText = p.title;
    document.getElementById('modal-category').innerText = p.category;
    document.getElementById('modal-desc').innerText = p.description;
    document.getElementById('modal-price').innerText = `$${p.price.toFixed(2)}`;
    
    // Gán sự kiện cho nút mua ngay trong modal
    const modalBtn = document.getElementById('modal-add-btn');
    if(modalBtn) {
        modalBtn.onclick = () => addToCart(p.id, p.title.replace(/'/g, "\\'"), p.price, p.image);
    }

    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Khóa cuộn trang khi mở modal
}

// Đóng modal khi bấm nút X hoặc bấm ra ngoài
const closeBtn = document.querySelector('.close-modal');
if (closeBtn) {
    closeBtn.onclick = () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    };
}

window.onclick = (e) => {
    if (e.target == modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
};

// 5. Tính năng tìm kiếm sản phẩm
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allProducts.filter(p => 
            p.title.toLowerCase().includes(term) || 
            p.category.toLowerCase().includes(term)
        );
        renderProducts(filtered);
    });
}

// Chạy ứng dụng khi web tải xong
document.addEventListener('DOMContentLoaded', initApp);

