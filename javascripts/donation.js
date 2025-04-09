// Global variables
let currentSlide = 0;
let selectedAmount = 0;
let selectedCampaign = "";
let campaignProgress = {};

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  updateSliderPosition();
  initializeQuotes();
  loadCampaigns();
});

// Load campaigns from database
function loadCampaigns() {
  fetch('get_campaigns.php')
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        const campaignSlider = document.querySelector('.campaign-slider');
        campaignSlider.innerHTML = ''; // Clear existing campaigns
        
        data.campaigns.forEach(campaign => {
          const campaignCard = createCampaignCard(campaign);
          campaignSlider.appendChild(campaignCard);
        });
        
        // Initialize slider after loading campaigns
        updateSliderPosition();
      }
    })
    .catch(error => console.error('Error loading campaigns:', error));
}

// Create campaign card HTML
function createCampaignCard(campaign) {
  const card = document.createElement('div');
  card.className = 'campaign-card';
  card.setAttribute('data-campaign', campaign.name);
  
  // Get a relevant image based on campaign name
  const imageKeyword = campaign.name.toLowerCase().replace(/\s+/g, '');
  
  card.innerHTML = `
     
    <h3>${campaign.name}</h3>
    <p>${campaign.description}</p>
    <div class="progress-container">
      <div class="progress-bar" style="width: ${campaign.progress}%"></div>
      <div class="progress-text">${campaign.progress}%</div>
    </div>
    <div class="amount-text">₹${campaign.current.toLocaleString()} / ₹${campaign.target.toLocaleString()}</div>
    <button onclick="openDonateForm('${campaign.name}')">Donate Now</button>
  `;
  
  return card;
}

// Fetch campaign progress from database
function fetchCampaignProgress() {
  fetch('get_campaign_progress.php')
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        campaignProgress = {};
        data.campaigns.forEach(campaign => {
          campaignProgress[campaign.name] = campaign;
          updateCampaignCard(campaign);
        });
      }
    })
    .catch(error => console.error('Error fetching campaign progress:', error));
}

// Update campaign card with progress
function updateCampaignCard(campaign) {
  const card = document.querySelector(`[data-campaign="${campaign.name}"]`);
  if (!card) return;

  const progressBar = card.querySelector('.progress-bar');
  const progressText = card.querySelector('.progress-text');
  const amountText = card.querySelector('.amount-text');

  if (progressBar) {
    progressBar.style.width = `${campaign.progress}%`;
  }
  if (progressText) {
    progressText.textContent = `${campaign.progress}%`;
  }
  if (amountText) {
    amountText.textContent = `₹${campaign.current.toLocaleString()} / ₹${campaign.target.toLocaleString()}`;
  }
}

// Slider functionality
function moveSlider(direction) {
  const slider = document.querySelector(".campaign-slider");
  const cards = document.querySelectorAll(".campaign-card");
  const cardWidth = cards[0].offsetWidth + 30;

  currentSlide += direction;
  if (currentSlide < 0) currentSlide = 0;
  if (currentSlide > cards.length - 1) currentSlide = cards.length - 1;

  updateSliderPosition();
}

function updateSliderPosition() {
  const slider = document.querySelector(".campaign-slider");
  const cards = document.querySelectorAll(".campaign-card");
  const cardWidth = cards[0].offsetWidth + 30;
  const scrollPosition = currentSlide * cardWidth;

  slider.scrollTo({
    left: scrollPosition,
    behavior: "smooth",
  });
}

// Donation form functionality
function openDonateForm(campaign = "") {
  const modal = document.getElementById("donate-modal");
  const campaignNameElement = document.getElementById("campaign-name");

  selectedCampaign = campaign;
  campaignNameElement.textContent = campaign
    ? `Campaign: ${campaign}`
    : "Your generosity can change lives";

  document.getElementById("donation-form").reset();
  document.getElementById("amount-value").textContent = "0";
  selectedAmount = 0;

  document.querySelectorAll(".amount-btn").forEach((btn) =>
    btn.classList.remove("active")
  );

  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeDonateForm() {
  document.getElementById("donate-modal").style.display = "none";
  document.body.style.overflow = "auto";
}

// Amount selection
function selectAmount(amount) {
  selectedAmount = amount;
  document.getElementById("amount-value").textContent = amount;
  document.getElementById("custom-amount").value = "";

  document.querySelectorAll(".amount-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.textContent === `₹${amount}`);
  });
}

function updateAmount(value) {
  if (value && !isNaN(value)) {
    selectedAmount = Number.parseInt(value);
    document.getElementById("amount-value").textContent = selectedAmount;
    document.querySelectorAll(".amount-btn").forEach((btn) =>
      btn.classList.remove("active")
    );
  }
}

// Email validation function
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Payment processing
function processPayment() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  // Validate name (no numbers allowed)
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    alert("Name should only contain letters and spaces");
    return;
  }

  // Validate phone number (exactly 10 digits)
  if (!/^\d{10}$/.test(phone)) {
    alert("Phone number must be exactly 10 digits");
    return;
  }

  if (!validateEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (selectedAmount <= 0) {
    alert("Please select a donation amount.");
    return;
  }

  const paymentModal = document.getElementById("payment-modal");
  paymentModal.style.display = "block";
  document.body.style.overflow = "hidden";

  // Create form data
  const formData = new URLSearchParams();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('phone', phone);
  formData.append('amount', selectedAmount);
  formData.append('campaign', selectedCampaign);
  formData.append('recurring', document.getElementById("recurring").checked ? '1' : '0');

  // Send to database
  fetch("process_donation.php", {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString()
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      // Update progress bars after successful donation
      loadCampaigns();
      
      // Continue with UI flow
      setTimeout(() => {
        paymentModal.style.display = "none";
        closeDonateForm();
        document.getElementById("success-amount").textContent = selectedAmount;
        document.getElementById("success-modal").style.display = "block";
      }, 2000);
    } else {
      alert(data.message || "An error occurred while processing your donation.");
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert("An error occurred while processing your donation. Please try again.");
  });
}

function closeSuccessModal() {
  document.getElementById("success-modal").style.display = "none";
  document.body.style.overflow = "auto";
}

// Close modals when clicking outside
window.onclick = (event) => {
  if (event.target === document.getElementById("donate-modal")) {
    closeDonateForm();
  }
  if (event.target === document.getElementById("success-modal")) {
    closeSuccessModal();
  }
};

// Quotes rotation functionality
const quotes = [
  '"The best way to find yourself is to lose yourself in the service of others." — Mahatma Gandhi',
  '"We make a living by what we get, but we make a life by what we give." — Winston Churchill',
  '"No one has ever become poor by giving." — Anne Frank',
  '"Giving is not just about making a donation. It\'s about making a difference." — Kathy Calvin',
  '"The meaning of life is to find your gift. The purpose of life is to give it away." — Pablo Picasso',
];

let currentQuoteIndex = 0;

function rotateQuotes() {
  const quoteElement = document.getElementById("hero-quote");
  quoteElement.style.opacity = 0;

  setTimeout(() => {
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    quoteElement.textContent = quotes[currentQuoteIndex];
    quoteElement.style.opacity = 1;
  }, 1000);
}

function initializeQuotes() {
  const quoteElement = document.getElementById("hero-quote");
  quoteElement.textContent = quotes[0];
  setInterval(rotateQuotes, 5000);
}
