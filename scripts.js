/* ===== UNIFIED SCRIPTS FOR LANDING PAGE AND BOOKING PAGE ===== */

// ===== WALLET ADDRESSES FOR CRYPTO PAYMENTS (BOOKING PAGE) =====
// WARNING: These are placeholder addresses. Replace with real wallet addresses before production use!
const walletAddresses = {
    'BTC': 'rexb2kgdygjrsqtzq2n0ycf2493p83kkfjhx0wlh',
    'ETH': '0x71C7656EC7ab88b098rexfB751B7401B5d2e3f4a',
    'USDT': 'T9yD14Nj9j7GzV2h4uQm1e3R2pK9n1a5rexx'
};

// BOOKING PAGE FUNCTIONS
// When user clicks a payment method, update the page
function selectPaymentMethod(clickedCard, paymentType) {
    // Remove active style from all payment cards
    const allCards = document.querySelectorAll('.payment-card');
    allCards.forEach(card => card.classList.remove('active'));

    // Add active style to the clicked card
    clickedCard.classList.add('active');

    // Hide all payment detail sections
    const allSections = document.querySelectorAll('.payment-details-section, .crypto-details-section');
    allSections.forEach(section => section.style.display = 'none');

    // Show the correct payment detail section (if exists)
    const detailsToShow = document.getElementById(paymentType + '-details');
    if (detailsToShow) detailsToShow.style.display = 'block';

    // Update price and banners
    const banner = document.querySelector('.discount-banner');
    const discountRow = document.getElementById('discount-row');
    const totalPrice = document.querySelector('.total-price');
    const savedText = document.querySelector('.saved-amount');
    const payBtn = document.querySelector('.pay-button');
    const taxText = document.getElementById('tax-amount');

    if (paymentType === 'paypal') {
        // Show discount for paypal payment
        if (banner) banner.style.display = 'flex';
        if (discountRow) discountRow.style.display = 'flex';
        if (savedText) savedText.style.display = 'inline';
        if (taxText) taxText.textContent = '$16.92';
        if (totalPrice) totalPrice.textContent = '$186.06';
        if (payBtn) payBtn.textContent = 'Pay $186.06';

        // Ensure the currently-active crypto button drives the wallet address
        const activeCryptoBtn = document.querySelector('.crypto-btn.active');
        if (activeCryptoBtn) {
            const cryptoType = activeCryptoBtn.textContent.trim().split('\n')[0];
            const short = cryptoType.replace(/\s+/g, '');
            if (walletAddresses[short]) {
                document.getElementById('wallet-address').textContent = walletAddresses[short];
            }
        }
    } else {
        // Hide discount for other payment methods
        if (banner) banner.style.display = 'none';
        if (discountRow) discountRow.style.display = 'none';
        if (savedText) savedText.style.display = 'none';
        if (taxText) taxText.textContent = '$19.90';
        if (totalPrice) totalPrice.textContent = '$218.90';
        if (payBtn) payBtn.textContent = 'Pay $218.90';
    }
}

// When user clicks a cryptocurrency button, change the wallet address
function selectCrypto(clickedButton, cryptoType) {
    // Remove active style from all crypto buttons
    const allButtons = document.querySelectorAll('.crypto-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));

    // Add active style to clicked button
    clickedButton.classList.add('active');

    // Update wallet address with the selected crypto's address
    const addressDisplay = document.getElementById('wallet-address');
    if (addressDisplay && walletAddresses[cryptoType]) {
        addressDisplay.textContent = walletAddresses[cryptoType];
    }
}

// Copy wallet address to clipboard when user clicks copy button
function copyAddress() {
    const addressElement = document.getElementById('wallet-address');
    const copyBtn = document.querySelector('.copy-btn');
    if (!copyBtn || !addressElement) return;

    const addressText = addressElement.textContent;
    const originalButtonText = copyBtn.textContent;

    // Copy address to clipboard with error handling
    navigator.clipboard.writeText(addressText)
        .then(() => {
            // Change button text to "Copied!"
            copyBtn.textContent = 'Copied!';

            setTimeout(() => {
                copyBtn.textContent = originalButtonText;
            }, 2000);
        })
        .catch((err) => {
            console.error('Failed to copy address:', err);
            alert('Failed to copy address. Please copy manually.');
        });
}

// LANDING PAGE FUNCTIONS
// Show/hide number dropdown based on passenger type selection
function showNumberDropdown() {
    const passengerType = document.getElementById('passengerType');
    const numberGroup = document.getElementById('numberGroup');

    if (passengerType && numberGroup) {
        if (passengerType.value !== '') {
            numberGroup.style.display = 'flex';
        } else {
            numberGroup.style.display = 'none';
        }
    }
}

// Store passenger selection
function storeSelection() {
    const passengerType = document.getElementById('passengerType');
    const passengerCount = document.getElementById('passengerCount');

    if (passengerType && passengerCount) {
        const type = passengerType.value;
        const count = passengerCount.value;
        console.log(`Selected: ${count} ${type}(s)`);
    }
}

// Newsletter subscription
function subscribe() {
    const emailInput = document.querySelector('.footer-newsletter-input');
    if (emailInput) {
        const email = emailInput.value.trim();
        if (email && email.includes('@')) {
            alert(`Thank you for subscribing with ${email}!`);
            emailInput.value = '';
        } else {
            alert('Please enter a valid email address.');
        }
    }
}



// DOCUMENT READY EVENT LISTENER
document.addEventListener('DOMContentLoaded', () => {
    // POPULATE BOOKING PAGE FROM URL PARAMETERS
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('from') && urlParams.has('to')) {
        const fromCity = urlParams.get('from');
        const toCity = urlParams.get('to');
        const departureDate = urlParams.get('departure');
        const returnDate = urlParams.get('return');
        const passengers = urlParams.get('passengers');
        const tripType = urlParams.get('tripType');
        const price = urlParams.get('price');

        // Extract city codes for route display (e.g., "London (LHR)" -> "LHR")
        const fromCode = fromCity.match(/\(([^)]+)\)/)?.[1] || fromCity.substring(0, 3).toUpperCase();
        const toCode = toCity.match(/\(([^)]+)\)/)?.[1] || toCity.substring(0, 3).toUpperCase();

        // Update flight route
        const routeEl = document.getElementById('flight-route');
        if (routeEl) {
            routeEl.textContent = `${fromCode} → ${toCode}`;
        }

        // Update departure date
        const departureDateEl = document.getElementById('departure-date');
        if (departureDateEl && departureDate) {
            const date = new Date(departureDate);
            departureDateEl.textContent = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }

        // Update passenger info
        const passengerInfoEl = document.getElementById('passenger-info');
        if (passengerInfoEl && passengers) {
            let passengerType = 'Passenger';
            if (passengers === '1') passengerType = 'Adult';
            else if (passengers === '2') passengerType = 'Child';
            else if (passengers === '3') passengerType = 'Infant';

            passengerInfoEl.textContent = `${passengerType} • Economy`;
        }

        // Update prices if price parameter exists
        if (price) {
            const baseFareEl = document.getElementById('base-fare');
            if (baseFareEl) {
                baseFareEl.textContent = price;
            }

            // Helper function to format number with commas
            function formatCurrency(num) {
                return num.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }

            // Calculate discount and tax based on price
            const priceNum = parseFloat(price.replace(/[$,]/g, ''));
            const discountAmount = priceNum * 0.15;
            const taxAmount = priceNum * 0.10;
            const totalAmount = priceNum - discountAmount + taxAmount;

            const discountEl = document.getElementById('discount-amount');
            if (discountEl) {
                discountEl.textContent = `-$${formatCurrency(discountAmount)}`;
            }

            const taxEl = document.getElementById('tax-amount');
            if (taxEl) {
                taxEl.textContent = `$${formatCurrency(taxAmount)}`;
            }

            const totalPriceEl = document.querySelector('.total-price');
            if (totalPriceEl) {
                totalPriceEl.textContent = `$${formatCurrency(totalAmount)}`;
            }

            const payButton = document.querySelector('.pay-button');
            if (payButton) {
                payButton.textContent = `Pay $${formatCurrency(totalAmount)}`;
            }
        }
    }

    // BOOKING PAGE INITIALIZATION
    const payBtn = document.querySelector('.pay-button');

    // Make payment-card elements keyboard accessible
    const paymentCards = document.querySelectorAll('.payment-card');
    paymentCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });

    // Determine initially active card and show its details
    const initialActive = document.querySelector('.payment-card.active');
    if (initialActive) {
        const attr = initialActive.getAttribute('onclick') || '';
        const match = attr.match(/selectPaymentMethod\(this, '\\'(.*)\\'/) || attr.match(/selectPaymentMethod\(this, '(.*)'\)/);
        const paymentType = match ? match[1] : 'bank';
        selectPaymentMethod(initialActive, paymentType);
    }

    if (payBtn) {
        payBtn.addEventListener('click', function () {
            // Check if bank transfer is selected
            const bankSection = document.getElementById('bank-details');
            if (bankSection && window.getComputedStyle(bankSection).display !== 'none') {
                // Get all input boxes in the bank section
                const inputBoxes = bankSection.querySelectorAll('.input-group input');
                let allInputsHaveText = true;

                // Check each input box
                inputBoxes.forEach(input => {
                    if (input.value.trim() === '') {
                        allInputsHaveText = false;
                        input.style.borderColor = 'red';
                    } else {
                        input.style.borderColor = '';
                    }
                });

                // If any box is empty, show error message and stop
                if (!allInputsHaveText) {
                    alert('Please fill in all required bank details.');
                    return;
                }
            }

            // Show processing message
            payBtn.textContent = 'Processing...';
        });
    }

    // LANDING PAGE INITIALIZATION 

    // Tab switching
    const flightTab = document.getElementById('flightTab');
    const carTab = document.getElementById('carTab');
    const flightForm = document.getElementById('flightForm');

    if (flightTab && carTab) {
        flightTab.addEventListener('click', () => {
            flightTab.classList.add('active');
            carTab.classList.remove('active');
            if (flightForm) flightForm.style.display = 'block';
        });

        carTab.addEventListener('click', () => {
            carTab.classList.add('active');
            flightTab.classList.remove('active');
        });
    }

    // Date validation - Set min date to today
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];

    // Initialize Flatpickr for date inputs if library is available
    let departurePicker, returnPicker;

    if (typeof flatpickr !== 'undefined' && dateInputs.length >= 2) {
        // Departure date picker
        departurePicker = flatpickr(dateInputs[0], {
            minDate: "today",
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "F j, Y",
            theme: "light",
            animate: true,
            monthSelectorType: "dropdown",
            showMonths: 1,
            onChange: function (selectedDates, dateStr) {
                // Update return date minimum when departure changes
                if (returnPicker) {
                    returnPicker.set('minDate', dateStr);

                    // Clear return date if it's before new departure date
                    const returnDate = returnPicker.selectedDates[0];
                    const departureDate = selectedDates[0];

                    if (returnDate && returnDate < departureDate) {
                        returnPicker.clear();
                    }
                }
            },
            onOpen: function (selectedDates, dateStr, instance) {
                instance.calendarContainer.classList.add('flatpickr-slide-in');
            }
        });

        // Return date picker
        returnPicker = flatpickr(dateInputs[1], {
            minDate: "today",
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "F j, Y",
            theme: "light",
            animate: true,
            monthSelectorType: "dropdown",
            showMonths: 1,
            onOpen: function (selectedDates, dateStr, instance) {
                instance.calendarContainer.classList.add('flatpickr-slide-in');

                // If departure date is selected, start calendar from that date
                if (departurePicker.selectedDates[0]) {
                    instance.jumpToDate(departurePicker.selectedDates[0]);
                }
            }
        });
    }

    // Trip type handling (Round Trip vs One Way)
    const tripTypeRadios = document.querySelectorAll('input[name="trip"]');
    const returnDateGroup = document.querySelector('.form-group:has(input[type="date"]:last-child)');

    tripTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'one-way' || e.target.nextSibling.textContent.trim() === 'One Way') {
                // Disable return date for one way
                if (returnDateGroup) {
                    returnDateGroup.style.opacity = '0.5';
                    if (returnPicker) {
                        returnPicker.input.disabled = true;
                        returnPicker.altInput.disabled = true;
                    }
                }
            } else {
                // Enable return date for round trip
                if (returnDateGroup) {
                    returnDateGroup.style.opacity = '1';
                    if (returnPicker) {
                        returnPicker.input.disabled = false;
                        returnPicker.altInput.disabled = false;
                    }
                }
            }
        });
    });

    // Passenger dropdown with realistic options
    const allSelects = document.querySelectorAll('.form-group select');
    const passengerSelect = allSelects[2]; // Third select element is passengers
    if (passengerSelect) {
        passengerSelect.innerHTML = `
        <option value="">Select Passengers</option>
        <option value="1">Adult</option>
        <option value="2">Child</option>
        <option value="3">Infant</option>
    `;
    }

    // City dropdowns with popular destinations
    const citySelects = [allSelects[0], allSelects[1]]; // First two selects are From and To

    // City list with associated prices
    const cityPrices = {
        'London (LHR)': '$1,384.89',
        'Sydney (SYD)': '$1200.92',
        'Toronto (YYZ)': '$1202.33',
        'Bangkok': '$1400.27',
        'Dubai (DXB)': '$1299.65',
        'New York (JFK)': '$1434.62',
        'New York': '$1531.28',
        'Tokyo (NRT)': '$1156.59',
        'Rome (FCO)': '$1299.65',
        'Paris (CDG)': '$1610.96'
    };

    const popularCities = [
        'Select City',
        'London (LHR)',
        'Sydney (SYD)',
        'Toronto (YYZ)',
        'Bangkok',
        'Dubai (DXB)',
        'New York (JFK)',
        'New York',
        'Tokyo (NRT)',
        'Rome (FCO)',
        'Paris (CDG)'
    ];

    citySelects.forEach((select, index) => {
        if (select) {
            select.innerHTML = popularCities.map((city, i) =>
                `<option value="${i === 0 ? '' : city}">${city}</option>`
            ).join('');
        }
    });

    // Search button functionality
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Get form values
            const fromCity = citySelects[0]?.value;
            const toCity = citySelects[1]?.value;
            const departureDate = dateInputs[0]?.value;
            const returnDate = dateInputs[1]?.value;
            const passengers = passengerSelect?.value;
            const tripType = document.querySelector('input[name="trip"]:checked');

            // Validation
            const errors = [];

            if (!fromCity) errors.push('Please select departure city');
            if (!toCity) errors.push('Please select arrival city');
            if (fromCity === toCity && fromCity) errors.push('Departure and arrival cities must be different');
            if (!departureDate) errors.push('Please select departure date');
            if (tripType?.nextSibling.textContent.trim() === 'Round Trip' && !returnDate) {
                errors.push('Please select return date for round trip');
            }
            if (!passengers) errors.push('Please select number of passengers');

            if (errors.length > 0) {
                alert('Please fix the following errors:\n\n' + errors.join('\n'));
                return;
            }

            // Get price for destination city
            const price = cityPrices[toCity] || '$0.00';

            // Show loading state
            searchBtn.disabled = true;
            searchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Searching...';

            // Simulate search and redirect to booking page
            setTimeout(() => {
                // Build query parameters
                const params = new URLSearchParams({
                    from: fromCity,
                    to: toCity,
                    departure: departureDate,
                    return: returnDate || '',
                    passengers: passengers,
                    tripType: tripType?.nextSibling.textContent.trim() || 'Round Trip',
                    price: price
                });

                // Redirect to booking page with search parameters
                window.location.href = `booking_page.html?${params.toString()}`;
            }, 1000);
        });
    }


    // NAVIGATION TOGGLE
    const navToggle = document.querySelector(".nav-toggle");
    const navGroups = document.querySelector(".nav-groups");

    if (navToggle && navGroups) {
        navToggle.addEventListener("click", () => {
            const isOpen = navGroups.classList.toggle("is-open");
            navToggle.classList.toggle("nav-toggle--open", isOpen);
            navToggle.setAttribute("aria-expanded", isOpen);
        });
    }

    // AUTHENTICATION STATE MANAGEMENT
    // Check if user is logged in and hide Sign In/Register buttons on index.html
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const navRight = document.querySelector('.nav-right');

    if (isLoggedIn === 'true' && navRight) {
        // Hide the entire nav-right section which contains Sign In and Register buttons
        navRight.style.display = 'none';
    }
}); // End of DOMContentLoaded

// COUNTDOWN TIMER (for car.html and soon.html)
// Launch date configuration and countdown timer
const LAUNCH_DATE = new Date('2026-01-01T00:00:00');
const PROGRESS_PERCENT = 85;

// Countdown timer helper function for padding numbers
function pad(v) {
    return String(v).padStart(2, '0');
}

// Countdown update function that works for both pages
function updateCountdown() {
    const now = new Date();
    const diff = Math.max(0, LAUNCH_DATE - now);

    // Get countdown elements
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // If countdown has ended
    if (diff <= 0) {
        const messageEl = document.getElementById('message');
        const comingSoonEl = document.querySelector('.coming-soon');
        const countdownEl = document.querySelector('.countdown');

        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';

        // Clear the interval
        if (window.countdownTimerRef) {
            clearInterval(window.countdownTimerRef);
        }

        // Update message for car.html
        if (messageEl) messageEl.textContent = "We are live — welcome!";

        // Update message for soon.html
        if (comingSoonEl) comingSoonEl.textContent = "We Are Live!";
        if (countdownEl) countdownEl.style.display = 'none';

        return;
    }

    // Calculate time units
    const sec = Math.floor(diff / 1000);
    const days = Math.floor(sec / 86400);
    const hours = Math.floor((sec % 86400) / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;

    
    // Check if we're on car.html by looking for the car-specific class
    const usePadding = document.querySelector('.car-card') !== null;

    // Update the display
    if (daysEl) daysEl.textContent = usePadding ? pad(days) : days;
    if (hoursEl) hoursEl.textContent = usePadding ? pad(hours) : hours;
    if (minutesEl) minutesEl.textContent = usePadding ? pad(minutes) : minutes;
    if (secondsEl) secondsEl.textContent = usePadding ? pad(seconds) : seconds;
}

// Initialize countdown if countdown elements exist
if (document.getElementById('days')) {
    updateCountdown();
    window.countdownTimerRef = setInterval(updateCountdown, 1000);
}

// Email notification form for coming soon pages (car.html)
const notifyForm = document.getElementById('notifyForm');
if (notifyForm) {
    const emailInput = document.getElementById('email');
    const message = document.getElementById('message');
    const notifyBtn = document.getElementById('notifyBtn');

    // Load saved email from localStorage
    (function loadSaved() {
        try {
            const saved = localStorage.getItem('notify_email');
            if (saved && emailInput) {
                emailInput.value = saved;
                if (message) message.textContent = "You are subscribed — we'll update you!";
            }
        } catch (e) { }
    })();

    // Email validation
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Form submission handler
    notifyForm.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (!emailInput || !message) return;

        const email = emailInput.value.trim();
        if (!email) {
            message.style.color = '#d04949';
            message.textContent = 'Please enter your email address';
            return;
        }
        if (!validateEmail(email)) {
            message.style.color = '#d04949';
            message.textContent = 'Please provide a valid email';
            emailInput.focus();
            return;
        }

        try {
            localStorage.setItem('notify_email', email);
            message.style.color = '';
            message.textContent = 'Thanks — we will notify you when we launch.';
            if (notifyBtn) {
                notifyBtn.disabled = true;
                notifyBtn.textContent = 'Saved';
                setTimeout(() => {
                    notifyBtn.disabled = false;
                    notifyBtn.textContent = 'Notify Me';
                }, 1500);
            }
        } catch (e) {
            message.style.color = '#d04949';
            message.textContent = 'Could not save — try again';
        }
    });
}

// Progress bar initialization (for car.html)
(function setProgress(v) {
    const fill = document.getElementById('progressFill');
    const pct = document.getElementById('progressPercent');
    if (!fill || !pct) return;

    v = Math.max(0, Math.min(100, v));
    fill.style.width = v + '%';
    pct.textContent = v + '%';

    const wrap = document.querySelector('.progress-wrap');
    if (wrap && wrap.parentElement && wrap.parentElement.setAttribute) {
        wrap.parentElement.setAttribute('aria-valuenow', String(v));
    }
})(PROGRESS_PERCENT);

// REGISTER PAGE FUNCTIONS
// Authentication page tab switching and form handling
if (document.getElementById('signin-tab') && document.getElementById('register-tab')) {
    const signinTab = document.getElementById('signin-tab');
    const registerTab = document.getElementById('register-tab');
    const signinForm = document.getElementById('signin-form');
    const registerForm = document.getElementById('register-form');
    const registerLink = document.getElementById('register-link');

    // Tab switching function
    function switchTab(tab) {
        if (tab === "signin") {
            if (signinTab) signinTab.classList.add("active");
            if (registerTab) registerTab.classList.remove("active");
            if (signinForm) signinForm.classList.add("active");
            if (registerForm) registerForm.classList.remove("active");
        } else {
            if (registerTab) registerTab.classList.add("active");
            if (signinTab) signinTab.classList.remove("active");
            if (registerForm) registerForm.classList.add("active");
            if (signinForm) signinForm.classList.remove("active");
        }
    }

    // Tab click handlers
    if (signinTab) {
        signinTab.addEventListener("click", () => switchTab("signin"));
    }
    if (registerTab) {
        registerTab.addEventListener("click", () => switchTab("register"));
    }
    if (registerLink) {
        registerLink.addEventListener("click", (e) => {
            e.preventDefault();
            switchTab("register");
        });
    }

    // Password toggle functionality
    const passwordToggles = document.querySelectorAll('.toggle-password');
    passwordToggles.forEach(btn => {
        btn.addEventListener("click", () => {
            const input = btn.previousElementSibling;
            if (input) {
                input.type = input.type === "password" ? "text" : "password";
            }
        });
    });

    // Social login buttons
    const googleBtns = document.querySelectorAll('.google-btn');
    const facebookBtns = document.querySelectorAll('.facebook-btn');

    googleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.open('https://accounts.google.com/signin', '_blank');
        });
    });

    facebookBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.open('https://www.facebook.com/login', '_blank');
        });
    });

    // Form submission handlers
    signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailEl = document.getElementById('email');
        const passEl = document.getElementById('password');
        if (emailEl && passEl) {
            console.log("Sign In Submitted:", emailEl.value, passEl.value);

            // Set authentication flag in localStorage
            localStorage.setItem('isLoggedIn', 'true');

            window.location.href = "index.html";
        }
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameEl = document.getElementById('fullname');
        const emailEl = document.getElementById('reg-email');
        const passEl = document.getElementById('reg-password');
        const confirmPassEl = document.getElementById('confirm-password');

        if (nameEl && emailEl && passEl && confirmPassEl) {
            // Check if passwords match
            if (passEl.value !== confirmPassEl.value) {
                // Highlight the password fields with red border
                passEl.style.borderColor = 'red';
                confirmPassEl.style.borderColor = 'red';

                // Show error alert
                alert('Passwords do not match! Please make sure both passwords are the same.');
                return; // Stop form submission
            }

            // Reset border colors if passwords match
            passEl.style.borderColor = '';
            confirmPassEl.style.borderColor = '';

            console.log("Register Submitted:", nameEl.value, emailEl.value, passEl.value, confirmPassEl.value);

            // Set authentication flag in localStorage
            localStorage.setItem('isLoggedIn', 'true');

            // Redirect to index.html
            window.location.href = "index.html";
        }
    });
}