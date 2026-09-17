// BeanBuzz RMS - API Helper Functions

class ApiClient {
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: { ...this.defaultHeaders, ...options.headers },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async get(endpoint, params = {}) {
        const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.append(key, params[key]);
            }
        });

        return this.request(url.pathname + url.search, {
            method: 'GET'
        });
    }

    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
}

// Create API client instance
const api = new ApiClient('api/');

// Authentication API
const AuthAPI = {
    async login(email, password) {
        return api.post('auth/login.php', { email, password });
    },

    async logout() {
        return api.post('auth/logout.php');
    },

    async checkSession() {
        return api.get('auth/check-session.php');
    }
};

// Menu API
const MenuAPI = {
    async getItems() {
        return api.get('menu/items.php');
    },

    async getItem(id) {
        return api.get('menu/get-item.php', { id });
    },

    async getCategories() {
        return api.get('menu/categories.php');
    },

    async addItem(itemData) {
        return api.post('menu/items.php', itemData);
    },

    async updateItem(id, itemData) {
        return api.put(`menu/items.php?id=${id}`, itemData);
    },

    async deleteItem(id) {
        return api.delete(`menu/items.php?id=${id}`);
    }
};

// Orders API
const OrdersAPI = {
    async create(orderData) {
        return api.post('orders/create.php', orderData);
    },

    async getAll(filters = {}) {
        return api.get('orders/list.php', filters);
    },

    async getById(id) {
        return api.get('orders/get.php', { id });
    },

    async updateStatus(orderId, status) {
        return api.post('orders/update-status.php', { order_id: orderId, status });
    },

    async getByCustomer(customerId) {
        return api.get('orders/list.php', { customer_id: customerId });
    },

    async getInProgress() {
        return api.get('orders/list.php', { status: 'confirmed,preparing,ready,served' });
    },

    async getQueue() {
        return api.get('orders/list.php', { status: 'confirmed,preparing' });
    }
};

// Inventory API
const InventoryAPI = {
    async getItems() {
        return api.get('inventory/items.php');
    },

    async updateStock(itemId, transactionType, quantity, reason) {
        return api.post('inventory/update-stock.php', {
            item_id: itemId,
            transaction_type: transactionType,
            quantity,
            reason
        });
    },

    async getTransactions(itemId = null, limit = 50) {
        const params = { limit };
        if (itemId) params.item_id = itemId;
        return api.get('inventory/transactions.php', params);
    },

    async addItem(itemData) {
        return api.post('inventory/items.php', itemData);
    },

    async updateItem(id, itemData) {
        return api.put(`inventory/items.php?id=${id}`, itemData);
    }
};

// Reservations API
const ReservationsAPI = {
    async create(reservationData) {
        return api.post('reservations/create.php', reservationData);
    },

    async getAll(date = null) {
        const params = {};
        if (date) params.date = date;
        return api.get('reservations/list.php', params);
    },

    async getById(id) {
        return api.get('reservations/get.php', { id });
    },

    async updateStatus(id, status) {
        return api.post('reservations/update-status.php', { id, status });
    },

    async getTables() {
        return api.get('reservations/tables.php');
    }
};

// Reports API
const ReportsAPI = {
    async getSalesReport(startDate, endDate) {
        return api.get('reports/sales.php', { start_date: startDate, end_date: endDate });
    },

    async getInventoryReport() {
        return api.get('reports/inventory.php');
    },

    async getPopularItems(period = 'week') {
        return api.get('reports/popular-items.php', { period });
    },

    async getRevenueReport(period = 'month') {
        return api.get('reports/revenue.php', { period });
    },

    async getStaffPerformance(startDate, endDate) {
        return api.get('reports/staff-performance.php', { start_date: startDate, end_date: endDate });
    }
};

// Staff API
const StaffAPI = {
    async getAttendance(userId = null, date = null) {
        const params = {};
        if (userId) params.user_id = userId;
        if (date) params.date = date;
        return api.get('staff/attendance.php', params);
    },

    async clockIn(userId) {
        return api.post('staff/clock-in.php', { user_id: userId });
    },

    async clockOut(userId) {
        return api.post('staff/clock-out.php', { user_id: userId });
    },

    async getSalary(userId, period = null) {
        const params = { user_id: userId };
        if (period) params.period = period;
        return api.get('staff/salary.php', params);
    },

    async getUsers(role = null) {
        const params = {};
        if (role) params.role = role;
        return api.get('staff/users.php', params);
    }
};

// Error handling wrapper
function withErrorHandling(apiFunction) {
    return async (...args) => {
        try {
            const result = await apiFunction(...args);
            return { success: true, data: result };
        } catch (error) {
            console.error('API Error:', error);
            return { 
                success: false, 
                error: error.message || 'An unexpected error occurred' 
            };
        }
    };
}

// Cached API calls
class CachedAPI {
    constructor() {
        this.cache = new Map();
        this.cacheDuration = 5 * 60 * 1000; // 5 minutes
    }

    async get(key, apiFunction, ...args) {
        const cachedItem = this.cache.get(key);
        const now = Date.now();

        if (cachedItem && (now - cachedItem.timestamp) < this.cacheDuration) {
            return cachedItem.data;
        }

        try {
            const data = await apiFunction(...args);
            this.cache.set(key, { data, timestamp: now });
            return data;
        } catch (error) {
            // If API fails, return cached data if available
            if (cachedItem) {
                console.warn('API failed, returning cached data:', error);
                return cachedItem.data;
            }
            throw error;
        }
    }

    clear(key = null) {
        if (key) {
            this.cache.delete(key);
        } else {
            this.cache.clear();
        }
    }
}

const cachedAPI = new CachedAPI();

// Batch API requests
async function batchRequests(requests) {
    const promises = requests.map(request => {
        const { endpoint, method = 'GET', data = {} } = request;
        return api[method.toLowerCase()](endpoint, data).catch(error => ({ error }));
    });

    return Promise.all(promises);
}

// Real-time updates (polling)
class RealtimeUpdater {
    constructor() {
        this.intervals = new Map();
    }

    start(key, callback, interval = 30000) {
        if (this.intervals.has(key)) {
            this.stop(key);
        }

        const intervalId = setInterval(callback, interval);
        this.intervals.set(key, intervalId);
        
        // Call immediately
        callback();
    }

    stop(key) {
        const intervalId = this.intervals.get(key);
        if (intervalId) {
            clearInterval(intervalId);
            this.intervals.delete(key);
        }
    }

    stopAll() {
        this.intervals.forEach((intervalId, key) => {
            clearInterval(intervalId);
        });
        this.intervals.clear();
    }
}

const realtimeUpdater = new RealtimeUpdater();

// Export APIs to global scope
window.API = {
    client: api,
    Auth: AuthAPI,
    Menu: MenuAPI,
    Orders: OrdersAPI,
    Inventory: InventoryAPI,
    Reservations: ReservationsAPI,
    Reports: ReportsAPI,
    Staff: StaffAPI,
    withErrorHandling,
    cached: cachedAPI,
    batch: batchRequests,
    realtime: realtimeUpdater
};