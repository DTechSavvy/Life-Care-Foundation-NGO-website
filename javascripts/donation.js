document.addEventListener('DOMContentLoaded', function() {
    const donateButtons = document.querySelectorAll('.donate-button');
    const donatePopup = document.getElementById('donate-popup');
    const closeButton = document.querySelector('.close-button');
    const amountButtons = document.querySelectorAll('.amount-button');
    const donationAmountInput = document.getElementById('donation-amount');
    const donationForm = document.getElementById('donation-form');
    const campaignSlider = document.querySelector('.campaign-slider'); // For dynamic content

    donateButtons.forEach(button => {
        button.addEventListener('click', () => {
            donatePopup.style.display = "block";
            // You can add logic here to pre-fill campaign info in the popup if needed
        });
    });

    closeButton.addEventListener('click', () => {
        donatePopup.style.display = "none";
    });

    window.addEventListener('click', (event) => {
        if (event.target == donatePopup) {
            donatePopup.style.display = "none";
        }
    });

    amountButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            donationAmountInput.value = event.target.textContent.substring(1); // Remove '₹' and set value
        });
    });

    donationForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        // Here you would typically handle form data submission
        // For example, send data to a server, integrate with a payment gateway, etc.
        const donorName = document.getElementById('donor-name').value;
        const donorEmail = document.getElementById('donor-email').value;
        const donorPhone = document.getElementById('donor-phone').value;
        const donationAmount = donationAmountInput.value;
        const recurringDonation = document.getElementById('recurring-donation').checked;

        console.log("Donation Form Data:", {
            name: donorName,
            email: donorEmail,
            phone: donorPhone,
            amount: donationAmount,
            recurring: recurringDonation
        });

        alert("Donation process initiated (details in console). In a real application, you would integrate with a payment gateway here.");
        donatePopup.style.display = "none"; // Close popup after submission
    });

    // --- Dynamic Campaign Simulation (Frontend) ---
    const campaignsData = [
        {
            image: 'campaign-image-4.jpg',
            title: 'Clean Water Initiative',
            description: 'Help us provide access to clean and safe drinking water in water-scarce regions.',
            campaignId: 'water'
        },
        {
            image: 'campaign-image-5.jpg',
            title: 'Empower Women through Vocational Training',
            description: 'Support skill-building programs for women to enhance their livelihoods.',
            campaignId: 'women-empowerment'
        },
        // Add more campaign data objects here
    ];

    campaignsData.forEach(campaign => {
        const campaignBlock = document.createElement('div');
        campaignBlock.classList.add('campaign-block');

        campaignBlock.innerHTML = `
            <img src="${campaign.image}" alt="${campaign.title}">
            <h3>${campaign.title}</h3>
            <p>${campaign.description}</p>
            <button class="donate-button" data-campaign="${campaign.campaignId}">Donate Now</button>
        `;
        campaignSlider.appendChild(campaignBlock);
    });

    // Re-attach event listeners to dynamically created buttons (important!)
    const dynamicDonateButtons = campaignSlider.querySelectorAll('.donate-button');
    dynamicDonateButtons.forEach(button => {
        button.addEventListener('click', () => {
            donatePopup.style.display = "block";
            // Logic to pre-fill campaign info in popup if needed, using button.dataset.campaign
        });
    });

});