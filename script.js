// Global Variables
let bookedAppointments = JSON.parse(localStorage.getItem('appointments')) || [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Hide loader
    setTimeout(() => {
        document.querySelector('.loader').style.opacity = '0';
        setTimeout(() => document.querySelector('.loader').style.display = 'none', 500);
    }, 1500);

    // Navbar scroll effect
    window.addEventListener('scroll', handleScroll);

    // Navbar links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-section');
            scrollToSection(target);
            setActiveNav(this);
        });
    });

    // Hamburger menu
    document.querySelector('.hamburger').addEventListener('click', toggleMobileMenu);

    // Form validation and submission
    document.getElementById('appointmentForm').addEventListener('submit', handleFormSubmit);

    // Input focus effects
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        input.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
        });
    });

    // Set minimum date for appointment
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').setAttribute('min', today);

    // Auto-hide success message
    setTimeout(() => {
        const successMsg = document.getElementById('successMessage');
        if (!successMsg.classList.contains('hidden')) {
            closeSuccess();
        }
    }, 5000);
});

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Scroll to top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navbar scroll handler
function handleScroll() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
            link.classList.add('active');
        }
    });

    // Show/hide scroll to top button
    const fab = document.querySelector('.fab');
    if (window.scrollY > 300) {
        fab.style.opacity = '1';
        fab.style.visibility = 'visible';
    } else {
        fab.style.opacity = '0';
        fab.style.visibility = 'hidden';
    }
}

// Set active nav link
function setActiveNav(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Form validation and submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = document.getElementById('appointmentForm');
    const formData = new FormData(form);
    const appointment = Object.fromEntries(formData);
    
    // Validation
    const errors = [];
    if (!appointment.pname || appointment.pname.length < 2) {
        showError('pname', 'Name must be at least 2 characters');
        errors.push('name');
    }
    if (!/01[3-9]\d{8}/.test(appointment.phone)) {
        showError('phone', 'Please enter a valid Bangladeshi phone number');
        errors.push('phone');
    }
    if (!appointment.doctor) {
        showError('doctor', 'Please select a doctor');
        errors.push('doctor');
    }
    
    if (errors.length > 0) return;
    
    // Clear previous errors
    clearErrors();
    
    // Save to localStorage
    bookedAppointments.push({
        ...appointment,
        id: Date.now(),
        status: 'Pending',
        submittedAt: new Date().toLocaleString()
    });
    localStorage.setItem('appointments', JSON.stringify(bookedAppointments));
    
    // Show success message
    showSuccess();
    
    // Reset form
    form.reset();
}

// Show error message
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = field.parentNode.querySelector('.error-message');
    errorEl.textContent = message;
    errorEl.classList.add('show');
    field.style.borderColor = '#ef4444';
}

// Clear all errors
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
    document.querySelectorAll('.form-group input, .form-group select').forEach(input => {
        input.style.borderColor = '';
    });
}

// Show success popup
function showSuccess() {
    document.getElementById('successMessage').classList.remove('hidden');
}

// Close success popup
function closeSuccess() {
    document.getElementById('successMessage').classList.add('hidden');
}

// Add CSS focus styles
const style = document.createElement('style');
style.textContent = `
    .form-group.focused label { color: var(--primary-color); }
    .form-group.focused input,
    .form-group.focused select,
    .form-group.focused textarea { border-color: var(--primary-color); }
`;
document.head.appendChild(style);
