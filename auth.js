/**
 * HTBILLIARD - Authentication Logic
 * Xử lý: Đăng nhập, Đăng ký, Đăng xuất và Trạng thái người dùng
 */

document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra trạng thái đăng nhập ngay khi tải trang
    checkLoginStatus();

    // Xử lý sự kiện gửi form Đăng nhập
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Lấy dữ liệu từ input
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;

            // Giả lập logic kiểm tra (Trong thực tế sẽ gửi API đến server)
            if (email && password.length >= 6) {
                const userData = {
                    name: email.split('@')[0], // Lấy phần trước @ làm tên hiển thị
                    email: email,
                    isLoggedIn: true,
                    loginTime: new Date().getTime()
                };

                // Lưu vào localStorage
                localStorage.setItem('HTB_USER', JSON.stringify(userData));
                
                alert('Đăng nhập thành công! Chào mừng ' + userData.name);
                
                // Chuyển hướng về trang chủ
                window.location.href = 'index.html';
            } else {
                alert('Vui lòng kiểm tra lại thông tin (Mật khẩu tối thiểu 6 ký tự)');
            }
        });
    }

    // Xử lý sự kiện gửi form Đăng ký
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
            // Chuyển sang tab đăng nhập sau khi đăng ký
            if (typeof toggleAuth === 'function') {
                toggleAuth('login');
            }
        });
    }
});

/**
 * Kiểm tra trạng thái đăng nhập để thay đổi giao diện Header
 */
function checkLoginStatus() {
    const userArea = document.getElementById('user-auth-area');
    if (!userArea) return;

    const user = JSON.parse(localStorage.getItem('HTB_USER'));

    if (user && user.isLoggedIn) {
        // Nếu đã đăng nhập: Hiển thị tên người dùng và menu thả xuống
        userArea.innerHTML = `
            <div class="user-logged-in" style="position: relative; cursor: pointer;">
                <div class="user-info" onclick="toggleUserMenu()">
                    <i class="fa fa-user-circle" style="color: var(--gold);"></i>
                    <span style="margin-left: 5px; font-weight: 600;">${user.name}</span>
                </div>
                <div id="user-dropdown" class="user-dropdown-content">
                    <a href="#"><i class="fa fa-history"></i> Lịch sử đơn hàng</a>
                    <a href="#"><i class="fa fa-cog"></i> Cài đặt</a>
                    <hr style="border: 0; border-top: 1px solid #222; margin: 5px 0;">
                    <a href="javascript:void(0)" onclick="logout()" style="color: #ff4d4d;">
                        <i class="fa fa-sign-out-alt"></i> Đăng xuất
                    </a>
                </div>
            </div>
        `;
        
        // Thêm CSS cho dropdown nếu chưa có
        addDropdownStyles();
    }
}

/**
 * Hàm Đăng xuất
 */
function logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi HTBILLIARD?')) {
        localStorage.removeItem('HTB_USER');
        window.location.reload(); // Tải lại trang để cập nhật giao diện
    }
}

/**
 * Đóng/Mở menu người dùng
 */
function toggleUserMenu() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Đóng menu nếu click ra ngoài
window.onclick = function(event) {
    if (!event.target.closest('.user-logged-in')) {
        const dropdowns = document.getElementsByClassName("user-dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove('show');
        }
    }
}

/**
 * Bổ sung style cho menu người dùng sau khi đăng nhập
 */
function addDropdownStyles() {
    if (document.getElementById('auth-dropdown-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'auth-dropdown-styles';
    style.innerHTML = `
        .user-dropdown-content {
            display: none;
            position: absolute;
            right: 0;
            top: 100%;
            background-color: #0a0a0a;
            min-width: 180px;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.5);
            z-index: 9999;
            border: 1px solid #222;
            border-radius: 4px;
            margin-top: 10px;
        }
        .user-dropdown-content a {
            color: #ccc;
            padding: 12px 16px;
            text-decoration: none;
            display: block;
            font-size: 13px;
            transition: 0.2s;
        }
        .user-dropdown-content a:hover {
            background-color: #111;
            color: var(--gold);
        }
        .user-dropdown-content.show {
            display: block;
            animation: fadeIn 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}