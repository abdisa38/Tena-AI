// General helper functions

// Format date to readable string
exports.formatDate = (date, locale = 'en-US') => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format date with time
exports.formatDateTime = (date, locale = 'en-US') => {
  return new Date(date).toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Calculate time ago
exports.timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [name, secondsInInterval] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInInterval);
    if (interval >= 1) {
      return `${interval} ${name}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

// Generate random ID
exports.generateId = (prefix = '', length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = prefix;
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

// Sanitize user input
exports.sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .substring(0, 1000); // Limit length
};

// Validate email format
exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Ethiopian format)
exports.isValidPhoneNumber = (phone) => {
  // Ethiopian phone format: +251XXXXXXXXX or 09XXXXXXXX
  const phoneRegex = /^(\+251|0)?[97]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Calculate age from date of birth
exports.calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Paginate array
exports.paginate = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: array.slice(startIndex, endIndex),
    page: page,
    limit: limit,
    total: array.length,
    pages: Math.ceil(array.length / limit)
  };
};

// Convert bytes to human readable format
exports.formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Sleep function for delays
exports.sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Capitalize first letter
exports.capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Generate random color (for charts/avatars)
exports.generateColor = (seed) => {
  const colors = [
    '#F8D743', // Tena Yellow
    '#111111', // Tena Black
    '#E7E7E2', // Cloud Gray
    '#4A90E2',
    '#7B68EE',
    '#50C878',
    '#FF6B6B'
  ];
  
  if (seed) {
    const index = seed.length % colors.length;
    return colors[index];
  }
  
  return colors[Math.floor(Math.random() * colors.length)];
};

// Check if date is today
exports.isToday = (date) => {
  const today = new Date();
  const compareDate = new Date(date);
  
  return today.toDateString() === compareDate.toDateString();
};

// Check if date is this week
exports.isThisWeek = (date) => {
  const today = new Date();
  const compareDate = new Date(date);
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  const weekEnd = new Date(today.setDate(weekStart.getDate() + 7));
  
  return compareDate >= weekStart && compareDate < weekEnd;
};

// Format currency
exports.formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Truncate text
exports.truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Remove duplicates from array
exports.removeDuplicates = (array) => {
  return [...new Set(array)];
};

// Deep clone object
exports.deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
exports.isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

// Generate slug from string
exports.slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// Get initials from name
exports.getInitials = (firstName, lastName) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

// Random number between min and max
exports.randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Check if user is adult (18+)
exports.isAdult = (dateOfBirth) => {
  return exports.calculateAge(dateOfBirth) >= 18;
};
