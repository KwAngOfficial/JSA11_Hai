function showToast(message, type = 'success') {
    
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <span style="margin-left:15px; cursor:pointer; opacity:0.7" onclick="this.parentElement.remove()">×</span>
    `;

    container.appendChild(toast);

    
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}


function switchTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');

    if (tab === 'login') {
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
    }
}


document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('reg-user').value.trim();
    const pass = document.getElementById('reg-pass').value;
    const confirm = document.getElementById('reg-confirm').value;
    const errorMsg = document.getElementById('reg-error');

    
    if (pass !== confirm) {
        errorMsg.innerText = " Mật khẩu xác nhận không khớp!";
        return;
    }

    
    let users = JSON.parse(localStorage.getItem('azon_users')) || [];

    
    const isExisted = users.find(u => u.username === user);
    if (isExisted) {
        errorMsg.innerText = " Tên đăng nhập đã tồn tại!";
        return;
    }

   
    users.push({ username: user, password: pass });

    
    localStorage.setItem('azon_users', JSON.stringify(users));

    
    showToast(" Đăng ký thành công! Hãy đăng nhập.", "success");
    switchTab('login'); 
});

// 3. XỬ LÝ ĐĂNG NHẬP (Lấy từ LocalStorage ra so sánh)
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('user-login').value.trim();
    const pass = document.getElementById('pass-login').value;
    const errorMsg = document.getElementById('login-error');

    // Lấy danh sách user từ LocalStorage
    let users = JSON.parse(localStorage.getItem('azon_users')) || [];

    // Tìm user khớp cả tài khoản và mật khẩu
    const validUser = users.find(u => u.username === user && u.password === pass);

    if (validUser) {
        
        
        localStorage.setItem('userToken', 'access_granted_' + user);
        localStorage.setItem('currentUser', user); // Lưu tên người dùng hiện tại
        
        window.location.href = 'index.html'; // Chuyển về trang chủ
    } else {
        errorMsg.innerText = " Tài khoản hoặc mật khẩu không đúng!";
        errorMsg.style.color = "red";
    }
});