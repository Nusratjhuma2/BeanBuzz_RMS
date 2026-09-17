# BeanBuzz Restaurant Management System

A comprehensive restaurant management system built with HTML, CSS, JavaScript, PHP, and MySQL for XAMPP deployment.

## Features

### Customer Features
- 🍽️ Browse menu with categories and detailed item information
- 🛒 Shopping cart functionality with quantity management
- 📅 Table reservations
- 📋 Order tracking and history
- 💰 Order total calculation with tax

### Staff Features (Role-based Access)

#### Waiter
- 📊 Dashboard with daily statistics
- 📝 Take orders for customers
- ⏱️ Track orders in progress
- 💳 Handle billing and payments
- ⏰ Attendance tracking
- 💵 Salary information

#### Chef
- 📊 Kitchen dashboard
- 🔥 Order queue management
- 📦 Inventory management
- 🥘 Update order preparation status

#### Manager
- 📊 Comprehensive dashboard
- 📈 Sales reports and analytics
- 💰 Financial overview
- 👥 Staff management (attendance, salary)
- 📦 Full inventory control
- 🔧 System administration

## Installation Guide

### Prerequisites
- XAMPP (Apache, MySQL, PHP 7.4+)
- Web browser (Chrome, Firefox, Safari, Edge)

### Step 1: Download and Setup XAMPP
1. Download XAMPP from [https://www.apachefriends.org](https://www.apachefriends.org)
2. Install XAMPP on your computer
3. Start Apache and MySQL services from XAMPP Control Panel

### Step 2: Setup the Application
1. Download/extract the BeanBuzz RMS files
2. Copy the entire project folder to `C:\xampp\htdocs\beanbuzz-rms\` (Windows) or `/opt/lampp/htdocs/beanbuzz-rms/` (Linux)
3. Open your web browser and go to `http://localhost/phpmyadmin`
4. Create a new database named `beanbuzz_rms`

### Step 3: Import Database
1. In phpMyAdmin, select the `beanbuzz_rms` database
2. Click on the "Import" tab
3. Click "Choose File" and select `database/schema.sql` from the project folder
4. Click "Go" to import the database schema

### Step 4: Configure Database Connection
1. Open `config/database.php`
2. Update database credentials if needed (default XAMPP settings should work):
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'beanbuzz_rms');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   ```

### Step 5: Set Permissions (Linux/Mac only)
```bash
chmod 755 beanbuzz-rms/
chmod 644 beanbuzz-rms/config/database.php
```

### Step 6: Access the Application
1. Open your web browser
2. Go to `http://localhost/beanbuzz-rms/`
3. The menu page should load successfully

## Default Login Credentials

### Manager Account
- **Email:** admin@beanbuzz.com
- **Password:** admin123

### Waiter Account
- **Email:** waiter@beanbuzz.com
- **Password:** waiter123

### Chef Account
- **Email:** chef@beanbuzz.com
- **Password:** chef123

## File Structure

```
beanbuzz-rms/
├── index.html              # Main application entry point
├── config/
│   └── database.php        # Database configuration
├── database/
│   └── schema.sql          # Database schema and sample data
├── api/
│   ├── auth/              # Authentication endpoints
│   ├── menu/              # Menu management endpoints
│   ├── orders/            # Order management endpoints
│   └── inventory/         # Inventory management endpoints
├── pages/
│   ├── menu.php           # Menu/homepage
│   ├── login.php          # Staff login
│   ├── cart.php           # Shopping cart
│   ├── dashboard.php      # Staff dashboard
│   └── [other pages]      # Additional pages
├── assets/
│   ├── css/
│   │   └── styles.css     # Main stylesheet
│   └── js/
│       ├── main.js        # Main application logic
│       └── [other js]     # Additional JavaScript files
└── README.md              # This file
```

## Usage Guide

### For Customers
1. Visit `http://localhost/beanbuzz-rms/`
2. Browse the menu and add items to cart
3. Review cart and place order
4. Track order status
5. Make table reservations

### For Staff
1. Click "Staff Login" from the menu
2. Use the provided demo credentials
3. Access role-specific features from the sidebar
4. Manage orders, inventory, and reports

## Customization

### Adding Menu Items
1. Login as Manager
2. Go to Inventory section
3. Add new menu items with descriptions and prices
4. Set availability and preparation times

### Modifying Colors/Theme
Edit `assets/css/styles.css` and update the CSS variables in the `:root` section:

```css
:root {
  --primary: #8b4513;        /* Coffee brown */
  --accent: #22c55e;         /* Green accent */
  --background: #fdfcf8;     /* Cream background */
  /* ... other variables */
}
```

### Adding New Features
1. Create new PHP pages in the `pages/` directory
2. Add API endpoints in the `api/` directory
3. Update navigation in `assets/js/main.js`
4. Add database tables if needed in `database/schema.sql`

## Database Schema

### Key Tables
- `users` - Staff and customer accounts
- `menu_items` - Restaurant menu items
- `menu_categories` - Menu categories
- `orders` - Customer orders
- `order_items` - Individual items in orders
- `inventory_items` - Stock management
- `reservations` - Table reservations
- `staff_attendance` - Employee attendance
- `staff_salaries` - Payroll information

## Security Features

- Password hashing with PHP's `password_hash()`
- SQL injection protection with prepared statements
- Session management with database tokens
- Role-based access control
- Input validation and sanitization

## Browser Compatibility

- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (responsive design)

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check XAMPP MySQL is running
   - Verify database credentials in `config/database.php`
   - Ensure `beanbuzz_rms` database exists

2. **Page Not Loading**
   - Check XAMPP Apache is running
   - Verify file permissions
   - Check browser console for JavaScript errors

3. **Login Not Working**
   - Verify database schema is imported
   - Check default user accounts exist
   - Clear browser cache and try again

4. **Cart Not Working**
   - Enable JavaScript in browser
   - Check browser console for errors
   - Clear localStorage: `localStorage.clear()`

### Support
For technical support or questions, check the troubleshooting section or review the code comments for guidance.

## License
This project is open source and available under the MIT License.

## Contributing
Feel free to submit issues and enhancement requests!