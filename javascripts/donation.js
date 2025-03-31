// Global variables
let currentSlide = 0;
let selectedAmount = 0;
let selectedCampaign = "";

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  updateSliderPosition();
  initializeQuotes();
});

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

  if (!name || !email || !phone || selectedAmount <= 0) {
    alert("Please fill all fields and select a donation amount.");
    return;
  }

  if (!validateEmail(email)) {
    alert("Please enter a valid email address.");
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
  .then(() => {
    // Continue with UI flow regardless of response
    setTimeout(() => {
      paymentModal.style.display = "none";
      closeDonateForm();
      document.getElementById("success-amount").textContent = selectedAmount;
      document.getElementById("success-modal").style.display = "block";
    }, 2000);
  })
  .catch(error => {
    console.error('Error:', error);
    // Continue with UI flow even if there's an error
    setTimeout(() => {
      paymentModal.style.display = "none";
      closeDonateForm();
      document.getElementById("success-amount").textContent = selectedAmount;
      document.getElementById("success-modal").style.display = "block";
    }, 2000);
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
