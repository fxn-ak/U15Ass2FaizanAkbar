// JavaScript for Pulse VR website
// Made by a BTEC student - simple functions that work

// wait for page to load before running code
document.addEventListener('DOMContentLoaded', function() {

    // ===== MOBILE HAMBURGER MENU =====
    // when you click the three lines, the menu slides in
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // close menu when you click a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // ===== BACK TO TOP BUTTON =====
    // shows button when you scroll down
    const backBtn = document.getElementById('backToTop');
    
    if (backBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backBtn.style.display = 'block';
            } else {
                backBtn.style.display = 'none';
            }
        });
        
        backBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== BOOKING FORM VALIDATION =====
    // checks all fields before letting user submit
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let valid = true;
            
            // get all form values
            const name = document.getElementById('fullname');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const game = document.getElementById('game');
            const date = document.getElementById('date');
            const time = document.getElementById('time');
            const players = document.getElementById('players');
            const venue = document.getElementById('venue');
            const terms = document.getElementById('terms');
            
            // clear old error messages
            document.querySelectorAll('.error').forEach(function(err) {
                err.innerHTML = '';
            });
            
            // check name
            if (!name.value.trim()) {
                document.getElementById('nameError').innerHTML = 'Please enter your name';
                valid = false;
            }
            
            // check email - needs to have @ and . 
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim()) {
                document.getElementById('emailError').innerHTML = 'Please enter your email';
                valid = false;
            } else if (!emailPattern.test(email.value)) {
                document.getElementById('emailError').innerHTML = 'Enter a valid email';
                valid = false;
            }
            
            // check phone - at least 10 numbers
            if (!phone.value.trim()) {
                document.getElementById('phoneError').innerHTML = 'Please enter your phone number';
                valid = false;
            } else if (phone.value.trim().length < 10) {
                document.getElementById('phoneError').innerHTML = 'Enter a valid UK phone number';
                valid = false;
            }
            
            // check game selected
            if (!game.value) {
                document.getElementById('gameError').innerHTML = 'Please select a game';
                valid = false;
            }
            
            // check date is not in the past
            if (!date.value) {
                document.getElementById('dateError').innerHTML = 'Please select a date';
                valid = false;
            } else {
                const selectedDate = new Date(date.value);
                const today = new Date();
                today.setHours(0,0,0,0);
                if (selectedDate < today) {
                    document.getElementById('dateError').innerHTML = 'Cannot pick a date in the past';
                    valid = false;
                }
            }
            
            // check time
            if (!time.value) {
                document.getElementById('timeError').innerHTML = 'Please select a time';
                valid = false;
            }
            
            // check players between 1 and 6
            if (!players.value) {
                document.getElementById('playersError').innerHTML = 'Please enter number of players';
                valid = false;
            } else if (players.value < 1 || players.value > 6) {
                document.getElementById('playersError').innerHTML = 'Players must be between 1 and 6';
                valid = false;
            }
            
            // check venue selected
            if (!venue.value) {
                document.getElementById('venueError').innerHTML = 'Please select a venue';
                valid = false;
            }
            
            // check terms box ticked
            if (!terms.checked) {
                document.getElementById('termsError').innerHTML = 'You must agree to the terms';
                valid = false;
            }
            
            // if all good, show confirmation
            if (valid) {
                bookingForm.style.display = 'none';
                const confirmDiv = document.getElementById('confirmationMsg');
                if (confirmDiv) confirmDiv.style.display = 'block';
            }
        });
    }

    // ===== GAME SEARCH AND FILTER (experiences page) =====
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const gameCards = document.querySelectorAll('.game-card');
    const noResultsDiv = document.getElementById('noResults');
    
    function filterGames() {
        let searchTerm = '';
        if (searchInput) {
            searchTerm = searchInput.value.toLowerCase();
        }
        
        let activeFilter = 'all';
        filterBtns.forEach(function(btn) {
            if (btn.classList.contains('active')) {
                activeFilter = btn.getAttribute('data-filter');
            }
        });
        
        let visibleCount = 0;
        
        gameCards.forEach(function(card) {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const desc = card.querySelector('p').textContent.toLowerCase();
            const category = card.getAttribute('data-category');
            
            const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);
            const matchesFilter = activeFilter === 'all' || category.includes(activeFilter);
            
            if (matchesSearch && matchesFilter) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // show no results message if nothing found
        if (noResultsDiv) {
            if (visibleCount === 0) {
                noResultsDiv.style.display = 'block';
            } else {
                noResultsDiv.style.display = 'none';
            }
        }
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', filterGames);
    }
    
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            filterGames();
        });
    });

    // ===== MEMBERSHIP CALCULATOR =====
    const sessionSlider = document.getElementById('sessionSlider');
    const sessionCountSpan = document.getElementById('sessionCount');
    const nonMemberTotalSpan = document.getElementById('nonMemberTotal');
    const memberTotalSpan = document.getElementById('memberTotal');
    const savingsTextSpan = document.getElementById('savingsText');
    
    function updateCalculator() {
        if (sessionSlider) {
            const sessions = parseInt(sessionSlider.value);
            const costPerSession = 25;
            const nonMember = sessions * costPerSession;
            const memberMonthly = 29.99;
            const memberDiscount = 0.2;
            const memberTotal = (sessions * costPerSession * (1 - memberDiscount)) + memberMonthly;
            
            sessionCountSpan.textContent = sessions + ' sessions';
            nonMemberTotalSpan.textContent = '£' + nonMember.toFixed(2);
            memberTotalSpan.textContent = '£' + memberTotal.toFixed(2);
            
            const savings = nonMember - (sessions * costPerSession * (1 - memberDiscount));
            if (savings > 0) {
                savingsTextSpan.textContent = 'You save £' + savings.toFixed(2) + ' per month!';
            } else if (savings === 0) {
                savingsTextSpan.textContent = 'You break even with membership';
            } else {
                savingsTextSpan.textContent = 'Membership pays for itself after a few sessions';
            }
        }
    }
    
    if (sessionSlider) {
        sessionSlider.addEventListener('input', updateCalculator);
        updateCalculator();
    }

    // ===== FAQ ACCORDION =====
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(function(question) {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            answer.classList.toggle('active');
            
            // change the arrow
            if (answer.classList.contains('active')) {
                this.textContent = this.textContent.replace('▼', '▲');
            } else {
                this.textContent = this.textContent.replace('▲', '▼');
            }
        });
    });

    // ===== ACCESSIBILITY TOOLBAR =====
    const increaseBtn = document.getElementById('increaseText');
    const decreaseBtn = document.getElementById('decreaseText');
    const contrastBtn = document.getElementById('highContrast');
    const resetBtn = document.getElementById('resetAccess');
    
    let currentFontSize = 100;
    
    function updateFontSize() {
        document.body.style.fontSize = currentFontSize + '%';
        localStorage.setItem('fontSize', currentFontSize);
    }
    
    if (increaseBtn) {
        increaseBtn.addEventListener('click', function() {
            if (currentFontSize < 150) {
                currentFontSize = currentFontSize + 10;
                updateFontSize();
            }
        });
    }
    
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', function() {
            if (currentFontSize > 70) {
                currentFontSize = currentFontSize - 10;
                updateFontSize();
            }
        });
    }
    
    // load saved font size
    const savedFont = localStorage.getItem('fontSize');
    if (savedFont) {
        currentFontSize = parseInt(savedFont);
        updateFontSize();
    }
    
    // high contrast mode
    if (contrastBtn) {
        contrastBtn.addEventListener('click', function() {
            document.body.classList.toggle('high-contrast');
            const isHighContrast = document.body.classList.contains('high-contrast');
            localStorage.setItem('highContrast', isHighContrast);
        });
    }
    
    // load saved contrast setting
    const savedContrast = localStorage.getItem('highContrast');
    if (savedContrast === 'true') {
        document.body.classList.add('high-contrast');
    }
    
    // reset all accessibility settings
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            currentFontSize = 100;
            updateFontSize();
            document.body.classList.remove('high-contrast');
            localStorage.removeItem('highContrast');
            alert('Accessibility settings have been reset');
        });
    }

    // ===== FIND MY LOCATION BUTTON (Google Maps) =====
    const findLocationBtn = document.getElementById('findLocationBtn');
    const mapIframe = document.getElementById('locationMap');
    
    if (findLocationBtn) {
        findLocationBtn.addEventListener('click', function() {
            if (navigator.geolocation) {
                findLocationBtn.textContent = 'Finding you...';
                findLocationBtn.disabled = true;
                
                navigator.geolocation.getCurrentPosition(function(position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    // update map to show user location
                    if (mapIframe) {
                        mapIframe.src = `https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`;
                    }
                    
                    findLocationBtn.textContent = '📍 Location Found';
                    setTimeout(function() {
                        findLocationBtn.textContent = '📍 Find My Location';
                        findLocationBtn.disabled = false;
                    }, 3000);
                }, function(error) {
                    let errorMsg = 'Could not find your location. ';
                    if (error.code === 1) {
                        errorMsg += 'Please allow location access.';
                    } else if (error.code === 2) {
                        errorMsg += 'Location unavailable.';
                    } else {
                        errorMsg += 'Try again later.';
                    }
                    alert(errorMsg);
                    findLocationBtn.textContent = '📍 Find My Location';
                    findLocationBtn.disabled = false;
                });
            } else {
                alert('Your browser does not support geolocation');
            }
        });
    }

    // ===== ACCESSIBILITY FEEDBACK FORM =====
    const accessForm = document.getElementById('accessForm');
    
    if (accessForm) {
        accessForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName');
            const email = document.getElementById('contactEmail');
            const topic = document.getElementById('feedbackTopic');
            const message = document.getElementById('feedbackMsg');
            
            let formOk = true;
            
            if (!name.value.trim()) {
                alert('Please enter your name');
                formOk = false;
            } else if (!email.value.trim()) {
                alert('Please enter your email');
                formOk = false;
            } else if (!topic.value) {
                alert('Please select a topic');
                formOk = false;
            } else if (!message.value.trim()) {
                alert('Please enter your feedback');
                formOk = false;
            }
            
            if (formOk) {
                accessForm.style.display = 'none';
                const confirmDiv = document.getElementById('feedbackConfirm');
                if (confirmDiv) confirmDiv.style.display = 'block';
            }
        });
    }

    // ===== MEMBERSHIP PLAN SELECTION =====
    let selectedPlan = null;

    window.selectPlan = function(plan) {
        const plans = document.querySelectorAll('.plan-selectable');
        
        plans.forEach(p => {
            p.classList.remove('selected');
            p.style.borderColor = '';
            p.style.borderWidth = '';
            p.style.borderStyle = '';
        });
        
        if (selectedPlan === plan) {
            selectedPlan = null;
            return;
        }
        
        const selectedElement = document.querySelector(`.plan-selectable[data-plan="${plan}"]`);
        if (selectedElement) {
            selectedElement.classList.add('selected');
            selectedElement.style.borderColor = '#8B0000';
            selectedElement.style.borderWidth = '3px';
            selectedElement.style.borderStyle = 'solid';
            selectedPlan = plan;
        }
    };

    // ===== SIGN UP BUTTON =====
    const signupBtn = document.querySelector('.signup-btn');
    if (signupBtn) {
        signupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Thanks for your interest! Please visit our centre to complete your membership sign-up.');
        });
    }

    // small console message to show js loaded
    console.log('Pulse VR website loaded');

});