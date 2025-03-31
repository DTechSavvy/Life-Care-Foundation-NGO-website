// Mobile Navigation
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle Navigation
    nav.classList.toggle('nav-active');

    // Animate Links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });

    // Burger Animation
    burger.classList.toggle('toggle');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Newsletter Form Submission
const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    if (email) {
        alert('Thank you for subscribing to our newsletter!');
        newsletterForm.reset();
    }
});

// Event Sign Up Buttons
const signupButtons = document.querySelectorAll('.signup-btn');
signupButtons.forEach(button => {
    button.addEventListener('click', () => {
        alert('Thank you for your interest! We will contact you soon with more details.');
    });
});

// Add scroll animation for sections
const sections = document.querySelectorAll('section');
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.5s ease-out';
    observer.observe(section);
});

// Add hover effect for cards
const cards = document.querySelectorAll('.news-card, .story-card, .event-card, .quote-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Add this new code for handling Read More functionality
document.querySelectorAll('.read-more-btn').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.news-card');
        const content = card.querySelector('.full-content');
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        // Create modal content
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                ${card.querySelector('h3').outerHTML}
                ${card.querySelector('.date').outerHTML}
                ${content.outerHTML}
            </div>
        `;
        
        // Add modal to page
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('active');
            modal.querySelector('.full-content').classList.add('active');
        }, 10);
        
        // Close modal functionality
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        });
    });
});

// Add keyboard support for closing modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }
});

// Story Modal Functionality
document.querySelectorAll('.story-read-more').forEach(button => {
    button.addEventListener('click', function() {
        const storyCard = this.closest('.story-card');
        const storyContent = storyCard.querySelector('.story-full').cloneNode(true);
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'story-modal';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'story-modal-content';
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'close-story';
        closeButton.innerHTML = '×';
        modalContent.appendChild(closeButton);
        
        // Add story content
        modalContent.appendChild(storyContent);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Show modal with animation
        requestAnimationFrame(() => {
            modal.classList.add('active');
            storyContent.classList.add('active');
        });
        
        // Close modal functionality
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        };
        
        closeButton.addEventListener('click', closeModal);
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    });
});

// Add smooth scroll animation for story gallery images
document.addEventListener('click', (e) => {
    if (e.target.matches('.story-gallery img')) {
        e.target.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}); 