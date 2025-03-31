// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Form Validation Functions
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhone(phone) {
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        return phoneRegex.test(phone);
    }

    function validateAge(age) {
        return !isNaN(age) && age >= 18 && age <= 100;
    }

    function validateAvailability(hours) {
        return !isNaN(hours) && hours >= 1 && hours <= 40;
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const existingError = formGroup.querySelector('.error-message');
        
        if (!existingError) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#ff3b30';
            errorDiv.style.fontSize = '0.8rem';
            errorDiv.style.marginTop = '5px';
            errorDiv.textContent = message;
            formGroup.appendChild(errorDiv);
        }
        
        input.style.borderColor = '#ff3b30';
    }

    function clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        input.style.borderColor = '';
    }

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

    // Real-time validation for registration form
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        const registrationInputs = registrationForm.querySelectorAll('input, textarea, select');
        
        registrationInputs.forEach(input => {
            input.addEventListener('input', function() {
                clearError(this);
            });
        });

        registrationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            let isValid = true;
            
            // Clear all previous errors
            registrationInputs.forEach(input => clearError(input));
            
            // Get form data
            const formData = new FormData(registrationForm);
            const data = Object.fromEntries(formData.entries());
            
            // Validate full name
            if (!data.fullName || data.fullName.trim().length < 2) {
                showError(registrationForm.fullName, 'Please enter a valid full name (minimum 2 characters)');
                isValid = false;
            }
            
            // Validate email
            if (!validateEmail(data.email)) {
                showError(registrationForm.email, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate phone
            if (!validatePhone(data.phone)) {
                showError(registrationForm.phone, 'Please enter a valid phone number (minimum 10 digits)');
                isValid = false;
            }
            
            // Validate age
            if (!validateAge(data.age)) {
                showError(registrationForm.age, 'Age must be between 18 and 100');
                isValid = false;
            }
            
            // Validate availability
            if (!validateAvailability(data.availability)) {
                showError(registrationForm.availability, 'Hours must be between 1 and 40');
                isValid = false;
            }
            
            // Validate interests
            const interests = Array.from(registrationForm.interests.selectedOptions).map(option => option.value);
            if (interests.length === 0) {
                showError(registrationForm.interests, 'Please select at least one area of interest');
                isValid = false;
            }
            
            // Validate terms
            if (!data.terms) {
                showError(registrationForm.terms, 'You must agree to the terms and conditions');
                isValid = false;
            }
            
            if (!isValid) {
                return;
            }
            
            // Add event details to the data
            const eventTitle = modalEventTitle.textContent;
            const eventDate = modalEventDate.textContent.replace('Date: ', '');
            
            // Format the data object
            const formattedData = {
                eventTitle: eventTitle,
                eventDate: eventDate,
                fullName: data.fullName.trim(),
                email: data.email.trim(),
                phone: data.phone.trim(),
                age: parseInt(data.age),
                experience: (data.experience || '').trim(),
                availability: parseInt(data.availability),
                interests: Array.from(registrationForm.interests.selectedOptions).map(option => option.value)
            };
            
            try {
                const response = await fetch('process_registration.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formattedData)
                });

                // Log the response for debugging
                console.log('Response status:', response.status);
                const responseText = await response.text();
                console.log('Response text:', responseText);

                // Try to parse the response as JSON
                let result;
                try {
                    result = JSON.parse(responseText);
                } catch (e) {
                    console.error('Failed to parse JSON response:', e);
                    throw new Error('Invalid server response');
                }
                
                if (result.success) {
                    alert('Thank you for registering! We will contact you soon.');
                    modal.style.display = 'none';
                    document.body.style.overflow = ''; // Restore scrolling
                    registrationForm.reset();
                } else {
                    throw new Error(result.error || 'Registration failed');
                }
            } catch (error) {
                alert('Error: ' + error.message);
                console.error('Registration error:', error);
            }
        });
    }

    // Real-time validation for contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const contactInputs = contactForm.querySelectorAll('input, textarea');
        
        contactInputs.forEach(input => {
            input.addEventListener('input', function() {
                clearError(this);
            });
        });

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            let isValid = true;
            
            // Clear all previous errors
            contactInputs.forEach(input => clearError(input));
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // Validate name
            if (!data.name || data.name.trim().length < 2) {
                showError(contactForm.name, 'Please enter a valid name (minimum 2 characters)');
                isValid = false;
            }
            
            // Validate email
            if (!validateEmail(data.email)) {
                showError(contactForm.email, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate subject
            if (!data.subject || data.subject.trim().length < 3) {
                showError(contactForm.subject, 'Please enter a valid subject (minimum 3 characters)');
                isValid = false;
            }
            
            // Validate message
            if (!data.message || data.message.trim().length < 10) {
                showError(contactForm.message, 'Please enter a message (minimum 10 characters)');
                isValid = false;
            }
            
            if (!isValid) {
                return;
            }
            
            try {
                // Store in localStorage
                const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
                messages.push({
                    ...data,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('contactMessages', JSON.stringify(messages));
                
                // Show success message
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
                
                // Log the message (for testing)
                console.log('Message saved:', data);
            } catch (error) {
                alert('Error sending message. Please try again.');
                console.error('Contact form error:', error);
            }
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
}); 
