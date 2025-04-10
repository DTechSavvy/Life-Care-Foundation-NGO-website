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
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`; // Fixed template literal syntax
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

// Read More functionality for news cards
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
        const storyFull = storyCard.querySelector('.story-full');
        
        // Create a modal
        const modal = document.createElement('div');
        modal.className = 'story-modal';
        
        // Create modal content
        modal.innerHTML = `
            <div class="story-modal-content">
                <button class="close-story">&times;</button>
                ${storyFull.innerHTML}
            </div>
        `;
        
        // Add modal to page
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Close modal functionality
        modal.querySelector('.close-story').addEventListener('click', () => {
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

// Add smooth scroll animation for story gallery images
document.addEventListener('click', (e) => {
    if (e.target.matches('.story-gallery img')) {
        e.target.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
});

// Video Lazy Loading
document.addEventListener('DOMContentLoaded', function() {
    const videoContainers = document.querySelectorAll('.video-container');
    const lazyLoadVideo = (container) => {
        const iframe = container.querySelector('iframe');
        if (iframe) {
            // Replace placeholder src with actual video URL
            const videoId = 'example'; // Replace with actual video ID
            iframe.src = `https://www.youtube.com/embed/${videoId}`; // Fixed template literal syntax
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        const readMoreButtons = document.querySelectorAll('.story-read-more');

        readMoreButtons.forEach(button => {
            button.addEventListener('click', function () {
                const storyCard = button.closest('.story-card');
                const fullStory = storyCard.querySelector('.story-full');

                const isOpen = fullStory.style.display === 'block';

                if (isOpen) {
                    fullStory.style.display = 'none';
                    button.textContent = 'Read Full Story';
                } else {
                    fullStory.style.display = 'block';
                    button.textContent = 'Show Less';
                    fullStory.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    });

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                lazyLoadVideo(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    videoContainers.forEach(container => {
        observer.observe(container);
    });
});