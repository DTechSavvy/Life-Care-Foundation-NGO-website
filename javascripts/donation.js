// Global variables
let currentSlide = 0
let selectedAmount = 0
let selectedCampaign = ""

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Set initial position of slider
  updateSliderPosition()
})

// Slider functionality
function moveSlider(direction) {
  const slider = document.querySelector(".campaign-slider")
  const cards = document.querySelectorAll(".campaign-card")
  const cardWidth = cards[0].offsetWidth + 30 // Card width + gap

  // Update current slide
  currentSlide += direction

  // Limit boundaries
  if (currentSlide < 0) currentSlide = 0
  if (currentSlide > cards.length - 1) currentSlide = cards.length - 1

  updateSliderPosition()
}

function updateSliderPosition() {
  const slider = document.querySelector(".campaign-slider")
  const cards = document.querySelectorAll(".campaign-card")
  const cardWidth = cards[0].offsetWidth + 30 // Card width + gap

  // Calculate scroll position
  const scrollPosition = currentSlide * cardWidth

  // Smooth scroll to position
  slider.scrollTo({
    left: scrollPosition,
    behavior: "smooth",
  })
}

// Donation form functionality
function openDonateForm(campaign = "") {
  const modal = document.getElementById("donate-modal")
  const campaignNameElement = document.getElementById("campaign-name")

  // Set campaign name if provided
  if (campaign) {
    selectedCampaign = campaign
    campaignNameElement.textContent = `Campaign: ${campaign}`
  } else {
    selectedCampaign = ""
    campaignNameElement.textContent = "Your generosity can change lives"
  }

  // Reset form
  document.getElementById("donation-form").reset()
  document.getElementById("amount-value").textContent = "0"
  selectedAmount = 0

  // Reset active amount buttons
  const amountButtons = document.querySelectorAll(".amount-btn")
  amountButtons.forEach((btn) => btn.classList.remove("active"))

  // Show modal
  modal.style.display = "block"

  // Prevent body scrolling
  document.body.style.overflow = "hidden"
}

function closeDonateForm() {
  const modal = document.getElementById("donate-modal")
  modal.style.display = "none"

  // Re-enable body scrolling
  document.body.style.overflow = "auto"
}

// Amount selection
function selectAmount(amount) {
  selectedAmount = amount
  document.getElementById("amount-value").textContent = amount
  document.getElementById("custom-amount").value = ""

  // Update active button
  const amountButtons = document.querySelectorAll(".amount-btn")
  amountButtons.forEach((btn) => {
    if (btn.textContent === `₹${amount}`) {
      btn.classList.add("active")
    } else {
      btn.classList.remove("active")
    }
  })
}

function updateAmount(value) {
  if (value && !isNaN(value)) {
    selectedAmount = Number.parseInt(value)
    document.getElementById("amount-value").textContent = selectedAmount

    // Remove active class from preset buttons
    const amountButtons = document.querySelectorAll(".amount-btn")
    amountButtons.forEach((btn) => btn.classList.remove("active"))
  }
}

// Add email validation function after the updateAmount function
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Update the processPayment function to include email validation
function processPayment() {
  // Validate form
  const name = document.getElementById("name").value
  const email = document.getElementById("email").value
  const phone = document.getElementById("phone").value

  if (!name || !email || !phone || selectedAmount <= 0) {
    alert("Please fill all fields and select a donation amount.")
    return
  }

  // Validate email format
  if (!validateEmail(email)) {
    alert("Please enter a valid email address.")
    return
  }

  // Close donation form
  closeDonateForm()

  // Show payment processing modal
  const paymentModal = document.getElementById("payment-modal")
  paymentModal.style.display = "block"

  // Update success amount
  document.getElementById("success-amount").textContent = selectedAmount

  // Simulate payment processing (15 seconds)
  setTimeout(() => {
    // Hide payment modal
    paymentModal.style.display = "none"

    // Show success modal
    const successModal = document.getElementById("success-modal")
    successModal.style.display = "block"
  }, 3000)
}

function closeSuccessModal() {
  const successModal = document.getElementById("success-modal")
  successModal.style.display = "none"

  // Re-enable body scrolling
  document.body.style.overflow = "auto"
}

// Close modals when clicking outside
window.onclick = (event) => {
  const donateModal = document.getElementById("donate-modal")
  const successModal = document.getElementById("success-modal")

  if (event.target === donateModal) {
    closeDonateForm()
  }

  if (event.target === successModal) {
    closeSuccessModal()
  }
}

// Add quotes rotation functionality at the end of the file
// Array of inspirational quotes
const quotes = [
  '"The best way to find yourself is to lose yourself in the service of others." — Mahatma Gandhi',
  '"We make a living by what we get, but we make a life by what we give." — Winston Churchill',
  '"No one has ever become poor by giving." — Anne Frank',
  '"Giving is not just about making a donation. It\'s about making a difference." — Kathy Calvin',
  '"The meaning of life is to find your gift. The purpose of life is to give it away." — Pablo Picasso',
]

let currentQuoteIndex = 0

// Function to rotate quotes
function rotateQuotes() {
  const quoteElement = document.getElementById("hero-quote")

  // Fade out
  quoteElement.style.opacity = 0

  setTimeout(() => {
    // Update quote
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length
    quoteElement.textContent = quotes[currentQuoteIndex]

    // Fade in
    quoteElement.style.opacity = 1
  }, 1000)
}

// Initialize quote rotation when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Set initial position of slider
  updateSliderPosition()

  // Initialize quotes
  const quoteElement = document.getElementById("hero-quote")
  quoteElement.textContent = quotes[0]

  // Start quote rotation
  setInterval(rotateQuotes, 5000) // Change quote every 5 seconds
})

