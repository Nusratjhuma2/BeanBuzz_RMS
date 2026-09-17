<?php
session_start();
require_once 'config/database.php';

// Get menu items for the homepage
$stmt = $db->query("
    SELECT mi.*, mc.name as category_name 
    FROM menu_items mi 
    LEFT JOIN menu_categories mc ON mi.category_id = mc.id 
    WHERE mi.is_available = 1 
    ORDER BY mc.display_order, mi.name
");
$menu_items = $stmt->fetchAll();

// Group items by category
$categories = [];
foreach ($menu_items as $item) {
    $category_name = $item['category_name'] ?: 'Other';
    if (!isset($categories[$category_name])) {
        $categories[$category_name] = [];
    }
    $categories[$category_name][] = $item;
}

// Check if user is logged in
$current_user = null;
if (isset($_SESSION['user_id'])) {
    $user_stmt = $db->query("SELECT * FROM users WHERE id = ?", [$_SESSION['user_id']]);
    $current_user = $user_stmt->fetch();
}

// Get current page from URL parameter
$current_page = $_GET['page'] ?? 'menu';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BeanBuzz Coffee & Bistro - Restaurant Management System</title>
    <link rel="stylesheet" href="assets/css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* Additional styles for better integration */
        .page-content {
            display: none;
        }
        .page-content.active {
            display: block;
        }
        .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 50vh;
            font-size: 1.2rem;
            color: var(--muted-foreground);
        }
    </style>
</head>
<body>
    <div id="app">
        <!-- Navigation Header -->
        <header class="header">
            <div class="container">
                <div class="flex justify-between items-center">
                    <div class="logo">
                        <h1><i class="fas fa-coffee"></i> BeanBuzz</h1>
                        <p class="text-muted">Coffee & Bistro</p>
                    </div>
                    
                    <nav class="nav">
                        <a href="?page=menu" class="nav-link <?php echo $current_page === 'menu' ? 'active' : ''; ?>">
                            <i class="fas fa-utensils"></i> Menu
                        </a>
                        <a href="?page=reservations" class="nav-link <?php echo $current_page === 'reservations' ? 'active' : ''; ?>">
                            <i class="fas fa-calendar"></i> Reservations
                        </a>
                        <a href="#" onclick="showCart()" class="nav-link">
                            <i class="fas fa-shopping-cart"></i> Cart (<span id="cartCount">0</span>)
                        </a>
                        
                        <?php if ($current_user): ?>
                            <a href="?page=dashboard" class="nav-link <?php echo $current_page === 'dashboard' ? 'active' : ''; ?>">
                                <i class="fas fa-tachometer-alt"></i> Dashboard
                            </a>
                            <a href="#" onclick="logout()" class="nav-link">
                                <i class="fas fa-sign-out-alt"></i> Logout
                            </a>
                        <?php else: ?>
                            <a href="?page=login" class="nav-link <?php echo $current_page === 'login' ? 'active' : ''; ?>">
                                <i class="fas fa-sign-in-alt"></i> Staff Login
                            </a>
                        <?php endif; ?>
                    </nav>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main id="mainContent">
            <?php
            // Route to appropriate page
            switch ($current_page) {
                case 'menu':
                    include 'pages/menu.php';
                    break;
                case 'cart':
                    include 'pages/cart.php';
                    break;
                case 'login':
                    include 'pages/login.php';
                    break;
                case 'dashboard':
                    if ($current_user) {
                        include 'pages/dashboard.php';
                    } else {
                        header('Location: ?page=login');
                        exit;
                    }
                    break;
                case 'take-order':
                    if ($current_user && in_array($current_user['role'], ['waiter', 'manager'])) {
                        include 'pages/take-order.php';
                    } else {
                        header('Location: ?page=login');
                        exit;
                    }
                    break;
                case 'order-queue':
                    if ($current_user && in_array($current_user['role'], ['chef', 'manager'])) {
                        include 'pages/order-queue.php';
                    } else {
                        header('Location: ?page=login');
                        exit;
                    }
                    break;
                case 'orders-progress':
                    if ($current_user && in_array($current_user['role'], ['waiter', 'manager'])) {
                        include 'pages/orders-progress.php';
                    } else {
                        header('Location: ?page=login');
                        exit;
                    }
                    break;
                case 'orders':
                    include 'pages/orders.php';
                    break;
                case 'inventory':
                    if ($current_user && in_array($current_user['role'], ['chef', 'manager'])) {
                        include 'pages/inventory.php';
                    } else {
                        header('Location: ?page=login');
                        exit;
                    }
                    break;
                case 'billing':
                    if ($current_user && in_array($current_user['role'], ['waiter', 'manager'])) {
                        include 'pages/billing.php';
                    } else {
                        header('Location: ?page=login');
                        exit;
                    }
                    break;
                case 'reservations':
                    include 'pages/reservations.php';
                    break;
                default:
                    include 'pages/menu.php';
            }
            ?>
        </main>

        <!-- Toast Notifications -->
        <div id="toastContainer" class="toast-container"></div>
        
        <!-- Loading Overlay -->
        <div id="loadingOverlay" class="loading-overlay" style="display: none;">
            <div class="loading">
                <i class="fas fa-coffee fa-spin"></i> Loading...
            </div>
        </div>
    </div>

    <!-- Include JavaScript Files -->
    <script src="assets/js/utils.js"></script>
    <script src="assets/js/api.js"></script>
    <script src="assets/js/main.js"></script>
    
    <script>
        // Initialize app with current user and page
        document.addEventListener('DOMContentLoaded', function() {
            // Set current user if logged in
            <?php if ($current_user): ?>
                app.currentUser = {
                    id: '<?php echo $current_user['id']; ?>',
                    name: '<?php echo htmlspecialchars($current_user['name']); ?>',
                    email: '<?php echo htmlspecialchars($current_user['email']); ?>',
                    role: '<?php echo $current_user['role']; ?>'
                };
            <?php endif; ?>
            
            // Set current page
            app.currentPage = '<?php echo $current_page; ?>';
            
            // Initialize cart from localStorage
            app.initializeCart();
            
            // Update cart count in navigation
            app.updateCartCount();
            
            // Initialize scroll animations
            initScrollAnimations();
            
            // Add smooth scroll behavior
            document.documentElement.style.scrollBehavior = 'smooth';
            
            console.log('BeanBuzz RMS initialized successfully');
        });

        // Scroll animations
        function initScrollAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, observerOptions);

            // Observe all elements with scroll-fade class
            document.querySelectorAll('.scroll-fade').forEach(el => {
                observer.observe(el);
            });
        }

        // Add smooth page transitions
        function smoothTransition(callback) {
            const main = document.getElementById('mainContent');
            main.style.opacity = '0';
            main.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                callback();
                main.style.transition = 'all 0.4s ease-out';
                main.style.opacity = '1';
                main.style.transform = 'translateY(0)';
            }, 200);
        }

        // Logout function
        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                fetch('api/auth/logout.php', { method: 'POST' })
                    .then(() => {
                        window.location.href = '?page=menu';
                    })
                    .catch(error => {
                        console.error('Logout error:', error);
                        window.location.href = '?page=menu';
                    });
            }
        }

        // Show cart function
        function showCart() {
            window.location.href = '?page=cart';
        }
    </script>
</body>
</html>