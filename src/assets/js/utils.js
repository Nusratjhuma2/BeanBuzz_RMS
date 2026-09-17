// BeanBuzz RMS - Utility Functions

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format date
function formatDate(date, format = 'short') {
    const options = {
        short: { month: 'short', day: 'numeric' },
        long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
        time: { hour: 'numeric', minute: '2-digit', hour12: true }
    };
    
    return new Intl.DateTimeFormat('en-US', options[format] || options.short).format(new Date(date));
}

// Format relative time (e.g., "2 minutes ago")
function formatRelativeTime(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    return formatDate(date);
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone number
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\(\)\+\.]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Generate random ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Local storage helpers
const Storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },
    
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },
    
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }
};

// Cookie helpers
const Cookie = {
    set(name, value, days = 7) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },
    
    get(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    
    remove(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
};

// Form validation helpers
const Validator = {
    required(value) {
        return value && value.toString().trim().length > 0;
    },
    
    email(value) {
        return this.required(value) && isValidEmail(value);
    },
    
    phone(value) {
        return this.required(value) && isValidPhone(value);
    },
    
    min(value, min) {
        return value && value.toString().length >= min;
    },
    
    max(value, max) {
        return value && value.toString().length <= max;
    },
    
    number(value) {
        return !isNaN(value) && isFinite(value);
    },
    
    positive(value) {
        return this.number(value) && parseFloat(value) > 0;
    }
};

// Form helper functions
function validateForm(formElement, rules) {
    const errors = {};
    let isValid = true;
    
    Object.keys(rules).forEach(fieldName => {
        const field = formElement.querySelector(`[name="${fieldName}"]`);
        const fieldRules = rules[fieldName];
        const value = field ? field.value : '';
        
        fieldRules.forEach(rule => {
            if (typeof rule === 'string') {
                if (!Validator[rule](value)) {
                    errors[fieldName] = errors[fieldName] || [];
                    errors[fieldName].push(`Field is ${rule}`);
                    isValid = false;
                }
            } else if (typeof rule === 'object') {
                const { type, message, params } = rule;
                if (!Validator[type](value, ...(params || []))) {
                    errors[fieldName] = errors[fieldName] || [];
                    errors[fieldName].push(message || `Field validation failed: ${type}`);
                    isValid = false;
                }
            }
        });
    });
    
    return { isValid, errors };
}

function showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (!field) return;
    
    // Remove existing error
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.cssText = 'color: var(--destructive); font-size: 0.875rem; margin-top: 0.25rem;';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
    
    // Add error styling to field
    field.style.borderColor = 'var(--destructive)';
}

function clearFieldErrors() {
    document.querySelectorAll('.field-error').forEach(error => error.remove());
    document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(field => {
        field.style.borderColor = '';
    });
}

// URL helpers
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
}

function updateUrlParam(key, value) {
    const url = new URL(window.location);
    if (value) {
        url.searchParams.set(key, value);
    } else {
        url.searchParams.delete(key);
    }
    window.history.replaceState({}, '', url);
}

// Element helpers
function createElement(tag, className, innerHTML) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

function removeElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

// Animation helpers
function fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = (timestamp - start) / duration;
        
        element.style.opacity = Math.min(progress, 1);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function fadeOut(element, duration = 300) {
    let start = null;
    const initialOpacity = parseFloat(window.getComputedStyle(element).opacity);
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = (timestamp - start) / duration;
        
        element.style.opacity = initialOpacity * (1 - Math.min(progress, 1));
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
        }
    }
    
    requestAnimationFrame(animate);
}

// Loading indicator
function showLoading(container, message = 'Loading...') {
    const loadingElement = createElement('div', 'loading-indicator', `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem;">
            <i class="fas fa-coffee fa-spin" style="font-size: 2rem; color: var(--primary); margin-bottom: 1rem;"></i>
            <p style="color: var(--muted-foreground);">${message}</p>
        </div>
    `);
    
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }
    
    if (container) {
        container.innerHTML = '';
        container.appendChild(loadingElement);
    }
    
    return loadingElement;
}

function hideLoading(container) {
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }
    
    if (container) {
        const loadingElement = container.querySelector('.loading-indicator');
        if (loadingElement) {
            removeElement(loadingElement);
        }
    }
}

// Export utilities to global scope
window.Utils = {
    formatCurrency,
    formatDate,
    formatRelativeTime,
    isValidEmail,
    isValidPhone,
    generateId,
    debounce,
    throttle,
    Storage,
    Cookie,
    Validator,
    validateForm,
    showFieldError,
    clearFieldErrors,
    getUrlParams,
    updateUrlParam,
    createElement,
    removeElement,
    fadeIn,
    fadeOut,
    showLoading,
    hideLoading
};