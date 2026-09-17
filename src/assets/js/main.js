// BeanBuzz RMS - Main JavaScript Application

class BeanBuzzRMS {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'menu';
        this.cart = [];
        this.sidebarCollapsed = false;
    }
    
    initializeCart() {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('beanbuzz_cart');
        if (savedCart) {
            try {
                this.cart = JSON.parse(savedCart);
            } catch (error) {
                console.error('Failed to load saved cart:', error);
                this.cart = [];
            }
        }
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }
    
    initEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }
        
        // Handle browser back/forward
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.page) {
                this.loadPage(event.state.page, false);
            }
        });
        
        // Mobile menu handling
        if (window.innerWidth <= 768) {
            document.addEventListener('click', (e) => {
                const sidebar = document.getElementById('sidebar');
                if (!sidebar.contains(e.target) && sidebar.classList.contains('show')) {
                    sidebar.classList.remove('show');
                }
            });
        }
    }
    
    async checkSession() {
        try {
            const response = await fetch('api/auth/check-session.php');
            const data = await response.json();
            
            if (data.success && data.user) {
                this.currentUser = data.user;
                this.currentPage = 'dashboard';
            } else {
                this.currentUser = null;
                this.currentPage = 'menu';
            }
        } catch (error) {
            console.error('Session check failed:', error);
            this.currentUser = null;
        }
    }
    
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('show');
        } else {
            sidebar.classList.toggle('collapsed');
            this.sidebarCollapsed = !this.sidebarCollapsed;
        }
    }
    
    updateNavigation() {
        const sidebarNav = document.getElementById('sidebarNav');
        const sidebarFooter = document.getElementById('sidebarFooter');
        
        if (!sidebarNav || !sidebarFooter) return;
        
        // Clear existing navigation
        sidebarNav.innerHTML = '';
        sidebarFooter.innerHTML = '';
        
        // Define navigation menus based on user role
        const navigationMenus = {
            guest: [
                { title: 'Home', icon: 'fas fa-home', page: 'menu' },
                { title: 'Menu', icon: 'fas fa-utensils', page: 'menu' },
                { title: 'Reservations', icon: 'fas fa-calendar', page: 'reservations' },
                { title: 'Staff Login', icon: 'fas fa-user', page: 'login' }
            ],
            customer: [
                { title: 'Menu', icon: 'fas fa-utensils', page: 'menu' },
                { title: 'Cart', icon: 'fas fa-shopping-cart', page: 'cart' },
                { title: 'Reservations', icon: 'fas fa-calendar', page: 'reservations' },
                { title: 'My Orders', icon: 'fas fa-clock', page: 'orders' }
            ],
            waiter: [
                { title: 'Dashboard', icon: 'fas fa-home', page: 'dashboard' },
                { title: 'Take Order', icon: 'fas fa-clipboard-list', page: 'take-order' },
                { title: 'Orders in Progress', icon: 'fas fa-clock', page: 'orders-progress' },
                { title: 'Billing', icon: 'fas fa-calculator', page: 'billing' },
                { title: 'Attendance', icon: 'fas fa-user-clock', page: 'attendance' },
                { title: 'Salary', icon: 'fas fa-dollar-sign', page: 'salary' }
            ],
            chef: [
                { title: 'Dashboard', icon: 'fas fa-home', page: 'dashboard' },
                { title: 'Order Queue', icon: 'fas fa-fire', page: 'order-queue' },
                { title: 'Inventory', icon: 'fas fa-boxes', page: 'inventory' }
            ],
            manager: [
                { title: 'Dashboard', icon: 'fas fa-home', page: 'dashboard' },
                { title: 'Take Order', icon: 'fas fa-clipboard-list', page: 'take-order' },
                { title: 'Orders in Progress', icon: 'fas fa-clock', page: 'orders-progress' },
                { title: 'Order Queue', icon: 'fas fa-fire', page: 'order-queue' },
                { title: 'Inventory', icon: 'fas fa-boxes', page: 'inventory' },
                { title: 'Reports', icon: 'fas fa-chart-bar', page: 'reports' },
                { title: 'Financials', icon: 'fas fa-file-invoice-dollar', page: 'financials' }
            ]
        };
        
        const userRole = this.currentUser ? this.currentUser.role : 'guest';
        const menuItems = navigationMenus[userRole] || navigationMenus.guest;
        
        // Create navigation items
        menuItems.forEach(item => {
            const navItem = document.createElement('button');
            navItem.className = `nav-item ${this.currentPage === item.page ? 'active' : ''}`;
            navItem.innerHTML = `<i class="${item.icon}"></i><span>${item.title}</span>`;
            navItem.addEventListener('click', () => this.navigateTo(item.page));
            sidebarNav.appendChild(navItem);
        });
        
        // Add cart badge for customers
        if (userRole === 'customer' && this.cart.length > 0) {
            const cartItem = sidebarNav.querySelector('.nav-item i.fa-shopping-cart');
            if (cartItem) {
                const badge = document.createElement('span');
                badge.className = 'badge badge-accent';
                badge.style.marginLeft = '0.5rem';
                badge.textContent = this.cart.length;
                cartItem.parentElement.appendChild(badge);
            }
        }
        
        // Add user info and logout if logged in
        if (this.currentUser) {
            const userInfo = document.createElement('div');
            userInfo.className = 'user-info';
            userInfo.innerHTML = `
                <div class="user-avatar">${this.currentUser.name.charAt(0).toUpperCase()}</div>
                <div class="user-details">
                    <h4>${this.currentUser.name}</h4>
                    <p>${this.currentUser.role.charAt(0).toUpperCase() + this.currentUser.role.slice(1)}</p>
                </div>
            `;
            
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'logout-btn';
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i><span>Logout</span>';
            logoutBtn.addEventListener('click', () => this.logout());
            
            sidebarFooter.appendChild(userInfo);
            sidebarFooter.appendChild(logoutBtn);
        }
    }
    
    navigateTo(page) {
        this.loadPage(page, true);
        
        // Close mobile sidebar
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('show');
        }
    }
    
    async loadPage(page, pushState = true) {
        const pageContent = document.getElementById('pageContent');
        if (!pageContent) return;
        
        // Update current page
        this.currentPage = page;
        
        // Update URL
        if (pushState) {
            history.pushState({ page }, '', `?page=${page}`);
        }
        
        // Show loading
        pageContent.innerHTML = `
            <div class="loading">
                <i class="fas fa-coffee fa-spin"></i>
                <p>Loading...</p>
            </div>
        `;
        
        try {
            // Load page content
            const response = await fetch(`pages/${page}.php`);
            const html = await response.text();
            
            pageContent.innerHTML = html;
            
            // Initialize page-specific functionality
            this.initPageFunctionality(page);
            
        } catch (error) {
            console.error(`Failed to load page ${page}:`, error);
            pageContent.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Page Not Found</h2>
                        <p class="card-description">The requested page could not be loaded.</p>
                    </div>
                    <button class="btn btn-primary" onclick="app.navigateTo('menu')">
                        <i class="fas fa-home"></i> Back to Menu
                    </button>
                </div>
            `;
        }
        
        // Update navigation
        this.updateNavigation();
    }
    
    initPageFunctionality(page) {
        switch (page) {
            case 'login':
                this.initLoginPage();
                break;
            case 'menu':
                this.initMenuPage();
                break;
            case 'cart':
                this.initCartPage();
                break;
            case 'dashboard':
                this.initDashboardPage();
                break;
            case 'take-order':
                this.initTakeOrderPage();
                break;
            case 'order-queue':
                this.initOrderQueuePage();
                break;
            case 'inventory':
                this.initInventoryPage();
                break;
            case 'reservations':
                this.initReservationsPage();
                break;
            default:
                break;
        }
    }
    
    initLoginPage() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(loginForm);
                const email = formData.get('email');
                const password = formData.get('password');
                
                try {
                    const response = await fetch('api/auth/login.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        this.currentUser = data.user;
                        this.showToast('Welcome back, ' + data.user.name + '!', 'success');
                        this.navigateTo('dashboard');
                    } else {
                        this.showToast(data.message || 'Login failed', 'error');
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    this.showToast('Login failed. Please try again.', 'error');
                }
            });
        }
    }
    
    initMenuPage() {
        // Initialize add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.itemId;
                this.addToCart(itemId);
            });
        });
    }
    
    initCartPage() {
        this.updateCartDisplay();
        
        // Initialize quantity controls
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.itemId;
                const action = e.target.dataset.action;
                this.updateCartQuantity(itemId, action);
            });
        });
        
        // Initialize checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }
    }
    
    async addToCart(itemId, itemName, itemPrice) {
        try {
            // If we have the item data, use it directly
            if (itemName && itemPrice) {
                const existingItem = this.cart.find(cartItem => cartItem.id == itemId);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    this.cart.push({
                        id: itemId,
                        name: itemName,
                        price: parseFloat(itemPrice),
                        quantity: 1
                    });
                }
                
                this.showToast(`${itemName} added to cart`, 'success');
                this.updateCartCount();
                
                // Save cart to localStorage
                localStorage.setItem('beanbuzz_cart', JSON.stringify(this.cart));
                return;
            }

            // Fallback to API call
            const response = await fetch(`api/menu/get-item.php?id=${itemId}`);
            const data = await response.json();
            
            if (data.success) {
                const item = data.item;
                const existingItem = this.cart.find(cartItem => cartItem.id === itemId);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    this.cart.push({
                        id: item.id,
                        name: item.name,
                        price: parseFloat(item.price),
                        quantity: 1
                    });
                }
                
                this.showToast(`${item.name} added to cart`, 'success');
                this.updateCartCount();
                
                // Save cart to localStorage
                localStorage.setItem('beanbuzz_cart', JSON.stringify(this.cart));
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            this.showToast('Failed to add item to cart', 'error');
        }
    }
    
    updateCartQuantity(itemId, action) {
        const item = this.cart.find(cartItem => cartItem.id == itemId);
        if (!item) return;
        
        if (action === 'increase') {
            item.quantity += 1;
        } else if (action === 'decrease') {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                this.removeFromCart(itemId);
                return;
            }
        }
        
        this.updateCartDisplay();
        this.updateCartCount();
        localStorage.setItem('beanbuzz_cart', JSON.stringify(this.cart));
    }
    
    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id != itemId);
        this.updateCartDisplay();
        this.updateCartCount();
        localStorage.setItem('beanbuzz_cart', JSON.stringify(this.cart));
        this.showToast('Item removed from cart', 'info');
    }
    
    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');
        
        if (!cartItems) return;
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p class="text-center">Your cart is empty</p>';
            if (cartTotal) cartTotal.textContent = '$0.00';
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }
        
        let total = 0;
        let html = '';
        
        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-item-id="${item.id}" data-action="decrease">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" data-item-id="${item.id}" data-action="increase">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                    <button class="btn btn-sm btn-destructive" onclick="app.removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        
        cartItems.innerHTML = html;
        if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
        if (checkoutBtn) checkoutBtn.disabled = false;
        
        // Re-initialize quantity controls
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.closest('.quantity-btn').dataset.itemId;
                const action = e.target.closest('.quantity-btn').dataset.action;
                this.updateCartQuantity(itemId, action);
            });
        });
    }
    
    async checkout() {
        if (this.cart.length === 0) return;
        
        try {
            const response = await fetch('api/orders/create.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: this.cart,
                    customer_name: this.currentUser ? this.currentUser.name : 'Guest Customer'
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.cart = [];
                localStorage.removeItem('beanbuzz_cart');
                this.showToast('Order placed successfully!', 'success');
                this.navigateTo('orders');
            } else {
                this.showToast(data.message || 'Checkout failed', 'error');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            this.showToast('Checkout failed. Please try again.', 'error');
        }
    }
    
    async logout() {
        try {
            const response = await fetch('api/auth/logout.php', {
                method: 'POST'
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.currentUser = null;
                this.cart = [];
                localStorage.removeItem('beanbuzz_cart');
                this.showToast('Logged out successfully', 'success');
                this.navigateTo('menu');
            }
        } catch (error) {
            console.error('Logout error:', error);
            this.showToast('Logout failed', 'error');
        }
    }
    
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle'
        };
        
        toast.innerHTML = `
            <i class="${iconMap[type] || iconMap.info}" style="animation: bounce 0.6s ease-out;"></i>
            <span>${message}</span>
            <button style="background: none; border: none; color: inherit; margin-left: auto; cursor: pointer; opacity: 0.7;" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add entrance animation
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        toastContainer.appendChild(toast);
        
        // Trigger animation
        requestAnimationFrame(() => {
            toast.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';
        });
        
        // Auto remove after 5 seconds with exit animation
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.transition = 'all 0.3s ease-out';
                toast.style.transform = 'translateX(100%)';
                toast.style.opacity = '0';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }
        }, 5000);
        
        // Click to dismiss with animation
        toast.addEventListener('click', () => {
            if (toast.parentNode) {
                toast.style.transition = 'all 0.3s ease-out';
                toast.style.transform = 'translateX(100%)';
                toast.style.opacity = '0';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }
        });
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new BeanBuzzRMS();
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('beanbuzz_cart');
    if (savedCart) {
        try {
            app.cart = JSON.parse(savedCart);
        } catch (error) {
            console.error('Failed to load saved cart:', error);
        }
    }
    
    // Handle URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    if (page) {
        app.currentPage = page;
    }
});