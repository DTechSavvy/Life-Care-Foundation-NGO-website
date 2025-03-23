// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            hamburger.classList.toggle('active');
        });
    }

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Active Navigation Link Highlight
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });

    // Countdown Timer Function
    function updateCountdown() {
        const eventCards = document.querySelectorAll('.event-card');
        
        eventCards.forEach(card => {
            try {
                const dateText = card.querySelector('.event-date').textContent;
                // Remove icons from the text and clean up
                const cleanDateText = dateText.replace(/[^\x00-\x7F]/g, "").trim();
                const [datePart, timePart] = cleanDateText.split('|').map(str => str.trim());
                
                if (datePart && timePart) {
                    const dateStr = `${datePart} ${timePart}`;
                    const eventDate = new Date(dateStr);
                    const now = new Date();
                    const timeLeft = eventDate - now;

                    // Calculate time units
                    const days = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60 * 24)));
                    const hours = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
                    const minutes = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));
                    const seconds = Math.max(0, Math.floor((timeLeft % (1000 * 60)) / 1000));

                    // Update the countdown display
                    const numbers = card.querySelectorAll('.countdown-timer .number');
                    if (numbers.length === 4) {
                        numbers[0].textContent = String(days).padStart(2, '0');
                        numbers[1].textContent = String(hours).padStart(2, '0');
                        numbers[2].textContent = String(minutes).padStart(2, '0');
                        numbers[3].textContent = String(seconds).padStart(2, '0');
                    }

                    // Handle expired events
                    if (timeLeft < 0) {
                        numbers.forEach(num => num.textContent = '00');
                        const registerBtn = card.querySelector('.register-btn');
                        if (registerBtn) {
                            registerBtn.textContent = 'Event Ended';
                            registerBtn.disabled = true;
                            registerBtn.style.backgroundColor = '#999';
                        }
                    }
                }
            } catch (error) {
                console.error('Error updating countdown for card:', error);
            }
        });
    }

    // Start countdown immediately and update every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Contact Form Submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Add fade-in animation
    document.querySelectorAll('.event-card, .about-content, .contact-form').forEach(element => {
        element.classList.add('fade-in');
    });

    // Initialize fade-in elements
    const fadeInOnScroll = () => {
        document.querySelectorAll('.fade-in').forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', fadeInOnScroll);
    fadeInOnScroll(); // Initial check

    // Registration Modal Functionality
    const modal = document.getElementById('registrationModal');
    const closeModal = document.querySelector('.close-modal');
    const registrationForm = document.getElementById('registrationForm');
    const modalEventTitle = document.getElementById('modalEventTitle');
    const modalEventDate = document.getElementById('modalEventDate');

    // Function to open the registration modal
    window.openRegistrationModal = function(eventTitle, eventDate) {
        modal.style.display = 'block';
        modalEventTitle.textContent = eventTitle;
        modalEventDate.textContent = `Date: ${eventDate}`;
    }

    // Close modal when clicking the X button
    closeModal.onclick = function() {
        modal.style.display = 'none';
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Handle registration form submission
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(registrationForm);
        const data = Object.fromEntries(formData.entries());
        
        // Add event details to the data
        data.eventTitle = modalEventTitle.textContent;
        data.eventDate = modalEventDate.textContent;
        
        // Here you would typically send the data to a server
        console.log('Registration Data:', data);
        
        // Show success message
        alert('Thank you for registering! We will contact you soon.');
        
        // Close modal and reset form
        modal.style.display = 'none';
        registrationForm.reset();
    });
}); 
