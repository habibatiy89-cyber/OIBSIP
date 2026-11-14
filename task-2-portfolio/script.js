/**
 * =========================================================
 * HABIBA T. · PERSONAL PORTFOLIO JAVASCRIPT
 * Beginner-Friendly, Vanilla JavaScript (No libraries needed)
 * 
 * Features:
 * 1. Dark / Light Theme Toggle (with localStorage persistence)
 * 2. Mobile Hamburger Navigation Menu
 * 3. Active Link Highlight on Scroll
 * 4. Contact Form Validation with Friendly Toast Notification
 * =========================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ---------------------------------------------------------
  // 1. THEME SWITCHER (DARK & LIGHT MODE)
  // ---------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  // Check saved theme in localStorage, default to 'dark'
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  body.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      
      // Accessibility update
      themeToggleBtn.setAttribute('aria-label', `Switch to ${currentTheme} mode`);
    });
  }

  // ---------------------------------------------------------
  // 2. MOBILE NAVIGATION MENU TOGGLE
  // ---------------------------------------------------------
  const menuToggleBtn = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggleBtn && navMenu) {
    // Toggle mobile menu open/close
    menuToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('nav-menu-open');
      menuToggleBtn.classList.toggle('is-active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('nav-menu-open');
        menuToggleBtn.classList.remove('is-active');
      });
    });
  }

  // ---------------------------------------------------------
  // 3. ACTIVE LINK HIGHLIGHT ON SCROLL
  // ---------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollPosition = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (correspondingLink) {
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          correspondingLink.classList.add('active');
        } else {
          correspondingLink.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink(); // Initial check on load

  // ---------------------------------------------------------
  // 4. INTERACTIVE CONTACT FORM VALIDATION & FEEDBACK
  // ---------------------------------------------------------
  const contactForm = document.getElementById('portfolio-contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const feedbackEl = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent page refresh

      let isValid = true;

      // Helper function to show input error
      function setError(inputEl, errorId, message) {
        const errorEl = document.getElementById(errorId);
        inputEl.classList.add('input-error');
        if (errorEl) {
          errorEl.textContent = message;
          errorEl.classList.add('visible');
        }
        isValid = false;
      }

      // Helper function to clear error
      function clearError(inputEl, errorId) {
        const errorEl = document.getElementById(errorId);
        inputEl.classList.remove('input-error');
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.classList.remove('visible');
        }
      }

      // Validate Name
      const nameVal = nameInput.value.trim();
      if (!nameVal || nameVal.length < 2) {
        setError(nameInput, 'name-error', 'Please enter your name (at least 2 letters).');
      } else {
        clearError(nameInput, 'name-error');
      }

      // Validate Email with regex
      const emailVal = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        setError(emailInput, 'email-error', 'Please enter a valid email address.');
      } else {
        clearError(emailInput, 'email-error');
      }

      // Validate Subject
      const subjectVal = subjectInput.value.trim();
      if (!subjectVal) {
        setError(subjectInput, 'subject-error', 'Please enter a subject.');
      } else {
        clearError(subjectInput, 'subject-error');
      }

      // Validate Message
      const messageVal = messageInput.value.trim();
      if (!messageVal || messageVal.length < 10) {
        setError(messageInput, 'message-error', 'Please write a message of at least 10 characters.');
      } else {
        clearError(messageInput, 'message-error');
      }

      // If all fields are valid, show encouraging feedback
      if (isValid) {
        feedbackEl.className = 'form-feedback success';
        feedbackEl.innerHTML = ` Thank you, <strong>${escapeHTML(nameVal)}</strong>! Your message has been sent. I will get back to you within 24 hours.`;
        
        // Reset form inputs
        contactForm.reset();

        // Clear feedback message after 8 seconds
        setTimeout(() => {
          feedbackEl.className = 'form-feedback';
          feedbackEl.innerHTML = '';
        }, 8000);
      } else {
        feedbackEl.className = 'form-feedback error';
        feedbackEl.textContent = 'Please fix the errors highlighted above before submitting.';
      }
    });

    // Clear individual errors on input typing
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          input.classList.remove('input-error');
          const errorEl = document.getElementById(`${input.id}-error`);
          if (errorEl) errorEl.classList.remove('visible');
        });
      }
    });
  }

  // Safe helper to prevent XSS in feedback string
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

});
