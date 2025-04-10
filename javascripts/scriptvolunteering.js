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

    // Form Validation Helper Functions
    function displayValidationError(field, message) {
        // Check if error element already exists
        let errorElement = field.parentNode.querySelector('.validation-error');
        
        if (!errorElement) {
            // Create error element if it doesn't exist
            errorElement = document.createElement('div');
            errorElement.className = 'validation-error';
            errorElement.style.color = '#ff3b30';
            errorElement.style.fontSize = '0.8rem';
            errorElement.style.marginTop = '0.3rem';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        
        // Highlight the field
        field.style.borderColor = '#ff3b30';
    }

    function clearValidationErrors() {
        const errorElements = document.querySelectorAll('.validation-error');
        errorElements.forEach(element => element.remove());
        
        const formFields = document.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.style.borderColor = '';
        });
    }

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
                // Remove error message for this input only
                const errorElement = this.parentNode.querySelector('.validation-error');
                if (errorElement) {
                    errorElement.remove();
                }
                
                // Reset border color
                this.style.borderColor = '';
            });
        });

        registrationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Reset previous validation errors
            clearValidationErrors();

            // Get form data
            const data = {
                fullName: this.fullName.value,
                email: this.email.value,
                phone: this.phone.value,
                age: this.age.value,
                experience: this.experience.value,
                availability: this.availability.value
            };

            // Validate form data
            let isValid = true;
            
            // Full Name validation - required, at least 3 characters, only letters and spaces
            if (!data.fullName || data.fullName.trim().length < 3) {
                displayValidationError(this.fullName, 'Name must be at least 3 characters');
                isValid = false;
            } else if (!/^[A-Za-z\s]+$/.test(data.fullName.trim())) {
                displayValidationError(this.fullName, 'Name should contain only letters and spaces');
                isValid = false;
            }

            // Email validation - required, valid email format
            if (!data.email || data.email.trim() === '') {
                displayValidationError(this.email, 'Email is required');
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
                displayValidationError(this.email, 'Please enter a valid email address');
                isValid = false;
            }

            // Phone validation - required, numeric, proper format
            if (!data.phone || data.phone.trim() === '') {
                displayValidationError(this.phone, 'Phone number is required');
                isValid = false;
            } else if (!/^\d{10}$/.test(data.phone.replace(/\D/g, ''))) {
                displayValidationError(this.phone, 'Please enter a valid 10-digit phone number');
                isValid = false;
            }

            // Age validation - required, numeric, between 18-100
            if (!data.age || data.age.trim() === '') {
                displayValidationError(this.age, 'Age is required');
                isValid = false;
            } else if (isNaN(data.age) || parseInt(data.age) < 18 || parseInt(data.age) > 100) {
                displayValidationError(this.age, 'Age must be between 18 and 100');
                isValid = false;
            }

            // Availability validation - required, numeric, positive
            if (!data.availability || data.availability.trim() === '') {
                displayValidationError(this.availability, 'Availability is required');
                isValid = false;
            } else if (isNaN(data.availability) || parseInt(data.availability) <= 0) {
                displayValidationError(this.availability, 'Please enter valid hours (greater than 0)');
                isValid = false;
            }

            // Interests validation - at least one interest must be selected
            if (this.interests.selectedOptions.length === 0) {
                displayValidationError(this.interests, 'Please select at least one area of interest');
                isValid = false;
            }

            // Terms and conditions validation
            if (!this.terms.checked) {
                displayValidationError(this.terms, 'You must agree to the terms and conditions');
                isValid = false;
            }

            if (!isValid) {
                return;
            }
            
            try {
                // Add event details to the data
                const modalEventTitle = document.querySelector('#modalEventTitle');
                const modalEventDate = document.querySelector('#modalEventDate');
                
                if (!modalEventTitle || !modalEventDate) {
                    throw new Error('Could not find event details');
                }
                
                const eventTitle = modalEventTitle.textContent || '';
                const eventDate = modalEventDate.textContent.replace('Date: ', '') || '';
                
                // Format the data object
                const formattedData = {
                    event_title: eventTitle.trim(),
                    event_date: eventDate.trim(),
                    full_name: data.fullName.trim(),
                    email: data.email.trim(),
                    phone: data.phone.replace(/\D/g, ''), // Remove non-digits
                    age: parseInt(data.age),
                    previous_experience: (data.experience || '').trim(),
                    availability: parseInt(data.availability),
                    areas_of_interest: Array.from(this.interests.selectedOptions).map(option => option.value).join(', '),
                    terms_accepted: this.terms.checked ? 1 : 0
                };
                
                // Validate required fields before sending
                if (!formattedData.event_title || !formattedData.event_date) {
                    throw new Error('Event details are missing');
                }
                
                console.log('Sending data:', formattedData); // Debug log
                
                const response = await fetch('process_registration.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formattedData)
                });

                console.log('Response status:', response.status); // Debug log
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const responseText = await response.text();
                console.log('Response text:', responseText); // Debug log
                
                let result;
                try {
                    result = JSON.parse(responseText);
                    if (!result || typeof result !== 'object') {
                        throw new Error('Invalid response format');
                    }
                } catch (e) {
                    console.error('Failed to parse response:', e, responseText);
                    throw new Error('Server returned invalid response. Please try again.');
                }
                
                if (result.success) {
                    alert('Thank you for registering! We will contact you soon.');
                    const modal = document.querySelector('#registrationModal');
                    if (modal) {
                        modal.style.display = 'none';
                        document.body.style.overflow = ''; // Restore scrolling
                    }
                    this.reset();
                } else {
                    throw new Error(result.error || 'Registration failed. Please try again.');
                }
            } catch (error) {
                alert('Error: ' + error.message);
                console.error('Registration error:', error);
            }
        });
    }

    // Real-time validation for contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Clear validation errors when input changes
        const contactInputs = contactForm.querySelectorAll('input, textarea');
        contactInputs.forEach(input => {
            input.addEventListener('input', function() {
                const errorElement = this.parentNode.querySelector('.validation-error');
                if (errorElement) {
                    errorElement.remove();
                }
                this.style.borderColor = '';
            });
        });

        // Handle form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent form from submitting normally
            
            // Clear any existing validation errors
            clearValidationErrors();

            // Get form data
            const formData = {
                name: this.querySelector('[name="name"]').value,
                email: this.querySelector('[name="email"]').value,
                subject: this.querySelector('[name="subject"]').value,
                message: this.querySelector('[name="message"]').value
            };

            // Validate form data
            let isValid = true;
            
            // Name validation
            if (!formData.name || formData.name.trim().length < 3) {
                displayValidationError(this.querySelector('[name="name"]'), 'Name must be at least 3 characters');
                isValid = false;
            } else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
                displayValidationError(this.querySelector('[name="name"]'), 'Name should contain only letters and spaces');
                isValid = false;
            }

            // Email validation
            if (!formData.email || formData.email.trim() === '') {
                displayValidationError(this.querySelector('[name="email"]'), 'Email is required');
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
                displayValidationError(this.querySelector('[name="email"]'), 'Please enter a valid email address');
                isValid = false;
            }

            // Subject validation
            if (!formData.subject || formData.subject.trim().length < 5) {
                displayValidationError(this.querySelector('[name="subject"]'), 'Subject must be at least 5 characters');
                isValid = false;
            }

            // Message validation
            if (!formData.message || formData.message.trim().length < 10) {
                displayValidationError(this.querySelector('[name="message"]'), 'Message must be at least 10 characters');
                isValid = false;
            }

            if (isValid) {
                try {
                    // Format the data
                    const messageData = {
                        name: formData.name.trim(),
                        email: formData.email.trim(),
                        subject: formData.subject.trim(),
                        message: formData.message.trim(),
                        date: new Date().toISOString()
                    };

                    // Store in localStorage
                    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
                    messages.push(messageData);
                    localStorage.setItem('contactMessages', JSON.stringify(messages));

                    // Show success message
                    alert('Thank you for your message! We will get back to you soon.');
                    
                    // Reset the form
                    this.reset();
                    
                    // Log for debugging
                    console.log('Message saved:', messageData);
                } catch (error) {
                    console.error('Error saving message:', error);
                    alert('Sorry, there was an error sending your message. Please try again.');
                }
            } else {
                // Scroll to the first error
                const firstError = document.querySelector('.validation-error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
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
