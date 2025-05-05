// Initialize Socket.io connection
const socket = io();
let selectedTable = null;

// Add loading state to elements
function addLoadingState(element) {
    element.classList.add('loading');
}

function removeLoadingState(element) {
    element.classList.remove('loading');
}

// Format date and time
function formatDateTime(date) {
    return new Date(date).toLocaleString();
}

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString();
}

// Handle form submissions with loading state
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                const originalText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.textContent = 'Loading...';

                // Re-enable button after submission (success or failure)
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }, 2000);
            }
        });
    });

    // Add fade-in animation to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle mobile navigation
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', () => {
            navbarCollapse.classList.toggle('show');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
                navbarCollapse.classList.remove('show');
            }
        });
    }

    // Handle flash messages
    const flashMessages = document.querySelectorAll('.alert');
    flashMessages.forEach(message => {
        setTimeout(() => {
            message.classList.add('fade');
            setTimeout(() => message.remove(), 300);
        }, 5000);
    });
});

// Initialize seating chart
function initializeSeatingChart(tables) {
    const container = document.querySelector('.tables-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    tables.forEach(table => {
        const tableElement = document.createElement('div');
        tableElement.className = `table ${table.status}`;
        tableElement.innerHTML = `Table ${table.tableNumber}`;
        tableElement.dataset.tableNumber = table.tableNumber;
        
        if (table.status === 'available') {
            tableElement.addEventListener('click', () => selectTable(table.tableNumber));
        }
        
        container.appendChild(tableElement);
    });
}

// Handle table selection
function selectTable(tableNumber) {
    if (selectedTable) {
        const prevTable = document.querySelector(`.table[data-table-number="${selectedTable}"]`);
        if (prevTable) prevTable.classList.remove('selected');
    }
    
    const newTable = document.querySelector(`.table[data-table-number="${tableNumber}"]`);
    if (newTable) {
        selectedTable = tableNumber;
        newTable.classList.add('selected');
    }
}

// Handle form submission
document.getElementById('reservationForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!selectedTable) {
        alert('Please select a table first');
        return;
    }
    
    const formData = {
        customerName: document.getElementById('customerName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        guests: document.getElementById('guests').value,
        specialRequests: document.getElementById('specialRequests').value,
        tableNumber: selectedTable
    };
    
    try {
        const response = await fetch('/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('Reservation successful!');
            window.location.reload();
        } else {
            const data = await response.json();
            alert(data.message || 'Error making reservation');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error making reservation');
    }
});

// Handle real-time updates
socket.on('tableStatusChanged', (data) => {
    const tableElement = document.querySelector(`.table[data-table-number="${data.tableNumber}"]`);
    if (tableElement) {
        tableElement.className = `table ${data.status}`;
        if (data.status === 'booked' && selectedTable === data.tableNumber) {
            selectedTable = null;
        }
    }
});

// Load initial table data
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/reservations/tables');
        if (response.ok) {
            const tables = await response.json();
            initializeSeatingChart(tables);
        }
    } catch (error) {
        console.error('Error loading tables:', error);
    }
});

// Error handling
function handleError(error, element) {
    console.error('Error:', error);
    if (element) {
        element.innerHTML = `
            <div class="alert alert-danger" role="alert">
                An error occurred. Please try again later.
            </div>
        `;
    }
}

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });

    return isValid;
}

// API calls with error handling
async function fetchAPI(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Export functions for use in other scripts
window.utils = {
    addLoadingState,
    removeLoadingState,
    formatDateTime,
    formatDate,
    formatTime,
    handleError,
    validateForm,
    fetchAPI
}; 
