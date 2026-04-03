/**
 * HTBILLIARD - Shopping Cart Logic
 * Xử lý giỏ hàng: Thêm, xóa, sửa số lượng và lưu trữ LocalStorage
 */

// 1. Khởi tạo giỏ hàng từ localStorage (nếu có) hoặc mảng rỗng
let cart = JSON.parse(localStorage.getItem('HTB_CART')) || [];

// 2. Chờ DOM load xong để chạy các hàm khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    updateCartIcon();
    
    // Nếu đang ở trang giỏ hàng, hàm renderCart() sẽ được gọi từ file html đó
    if (typeof renderCart === 'function') {
        renderCart();
    }
});

/**
 * Cập nhật số lượng sản phẩm hiển thị trên icon giỏ hàng (Header)
 */
function updateCartIcon() {
    const cartIcons = document.querySelectorAll('.fa-shopping-cart');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    cartIcons.forEach(icon => {
        let badge = icon.querySelector('.cart-badge');
        
        if (totalItems > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                // Style trực tiếp để đảm bảo hiển thị đúng tone màu Gold/Black
                Object.assign(badge.style, {
                    position: 'absolute',
                    top: '-8px',
                    right: '-10px',
                    background: '#ffb400',
                    color: '#000',
                    fontSize: '10px',
                    fontWeight: '800',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #000'
                });
                icon.style.position = 'relative';
                icon.appendChild(badge);
            }
            badge.innerText = totalItems;
        } else {
            if (badge) badge.remove();
        }
    });
}

/**
 * Thêm sản phẩm vào giỏ hàng
 * @param {string} id - ID duy nhất của sản phẩm
 * @param {string} name - Tên sản phẩm
 * @param {number} price - Giá sản phẩm (số)
 * @param {string} image - Link ảnh sản phẩm
 */
function addToCart(id, name, price, image) {
    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ chưa
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    saveCart();
    updateCartIcon();
    showToast(`Đã thêm ${name} vào giỏ hàng!`);
}

/**
 * Lưu giỏ hàng vào LocalStorage
 */
function saveCart() {
    localStorage.setItem('HTB_CART', JSON.stringify(cart));
}

/**
 * Lắng nghe sự kiện click toàn trang để xử lý các nút "Thêm vào giỏ"
 */
document.addEventListener('click', (e) => {
    // Kiểm tra nếu click vào nút có class 'btn-add-cart'
    if (e.target.classList.contains('btn-add-cart')) {
        const btn = e.target;
        const card = btn.closest('.product-card');
        
        // Lấy thông tin từ data attributes và nội dung thẻ
        const id = btn.dataset.id || 'SP-' + Math.random().toString(36).substr(2, 5);
        const name = btn.dataset.name || card.querySelector('.product-name').innerText;
        const price = parseInt(btn.dataset.price);
        const image = card.querySelector('img').src;

        addToCart(id, name, price, image);
    }
});

/**
 * Hiển thị thông báo nhỏ (Toast) khi thêm hàng thành công
 */
function showToast(message) {
    const toast = document.createElement('div');
    toast.innerText = message;
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#ffb400',
        color: '#000',
        padding: '12px 25px',
        borderRadius: '30px',
        fontWeight: 'bold',
        zIndex: '10000',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        animation: 'fadeUp 0.5s ease-out'
    });

    document.body.appendChild(toast);

    // Tự động xóa thông báo sau 2.5 giây
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = '0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}

// Thêm animation fadeUp vào style của trang
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeUp {
        from { opacity: 0; transform: translate(-50%, 20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
`;
document.head.appendChild(style);