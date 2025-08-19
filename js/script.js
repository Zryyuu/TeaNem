let currentGalleryIndex = 0;
let galleryItems = [];
let ticketQuantities = {
    reguler: 0,
    vip: 0,
    premium: 0
};
let selectedCompetitions = [];
let currentTransactionData = {};

document.addEventListener('DOMContentLoaded', function() {
    initializeNavbar();
    initializeCountdown();
    initializeGallery();
    initializeModals();
    initializeForms();
});

function initializeNavbar() {
    const navbar = document.getElementById('navbar');
    const burgerMenu = document.getElementById('burgerMenu');
    const navLinks = document.getElementById('navLinks');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        }
    });
    
    if (burgerMenu) {
        burgerMenu.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            burgerMenu.classList.toggle('active');
        });
    }
    
    const navLinksElements = document.querySelectorAll('.nav-link');
    navLinksElements.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            navLinks.classList.remove('active');
            burgerMenu.classList.remove('active');
        });
    });
}

function initializeCountdown() {
    const targetDate = new Date('2025-08-14T07:40:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = targetDate - now;
        
        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        } else {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function initializeGallery() {
    galleryItems = document.querySelectorAll('.gallery-item');
    const galleryDots = document.getElementById('galleryDots');
    
    galleryItems.forEach((item, index) => {
        const dot = document.createElement('div');
        dot.classList.add('gallery-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToGallery(index));
        galleryDots.appendChild(dot);
    });
    
    setInterval(() => {
        changeGallery(1);
    }, 5000);
}

function switchGalleryTab(category) {
    const tabs = document.querySelectorAll('.tab-btn');
    const items = document.querySelectorAll('.gallery-item');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Reset gallery items display
    items.forEach(item => {
        item.style.display = 'none';
    });
    
    // Show only items of selected category
    const visibleItems = [];
    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (itemCategory === category) {
            item.style.display = 'block';
            visibleItems.push(item);
        }
    });
    
    // Reset gallery position and update dots
    currentGalleryIndex = 0;
    updateGalleryDisplay();
    updateGalleryDots(visibleItems.length);
}

function changeGallery(direction) {
    const visibleItems = Array.from(galleryItems).filter(item => 
        getComputedStyle(item).display !== 'none'
    );
    
    if (visibleItems.length === 0) return;
    
    currentGalleryIndex += direction;
    
    if (currentGalleryIndex >= visibleItems.length) {
        currentGalleryIndex = 0;
    } else if (currentGalleryIndex < 0) {
        currentGalleryIndex = visibleItems.length - 1;
    }
    
    updateGalleryDisplay();
    updateGalleryDots(visibleItems.length);
}

function goToGallery(index) {
    const visibleItems = Array.from(galleryItems).filter(item => 
        getComputedStyle(item).display !== 'none'
    );
    
    if (index >= 0 && index < visibleItems.length) {
        currentGalleryIndex = index;
        updateGalleryDisplay();
        updateGalleryDots(visibleItems.length);
    }
}

function updateGalleryDisplay() {
    const galleryWrapper = document.getElementById('galleryWrapper');
    if (!galleryWrapper) return;
    
    // Ensure smooth transition
    galleryWrapper.style.transition = 'transform 0.5s ease-in-out';
    
    // Calculate exact translation - ensure full slide
    const translateX = -currentGalleryIndex * 100;
    galleryWrapper.style.transform = `translateX(${translateX}%)`;
    
    // Force repaint to ensure smooth animation
    galleryWrapper.offsetHeight;
}

function updateGalleryDots(totalVisible = null) {
    const dots = document.querySelectorAll('.gallery-dot');
    const visibleItems = totalVisible || Array.from(galleryItems).filter(item => 
        getComputedStyle(item).display !== 'none'
    ).length;
    
    dots.forEach((dot, index) => {
        if (index < visibleItems) {
            dot.style.display = 'block';
            dot.classList.toggle('active', index === currentGalleryIndex);
        } else {
            dot.style.display = 'none';
        }
    });
}

function initializeModals() {
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });
}

function openTicketModal() {
    document.getElementById('ticketModal').style.display = 'block';
    resetTicketForm();
}

function closeTicketModal() {
    document.getElementById('ticketModal').style.display = 'none';
}

function openRegistrationModal() {
    document.getElementById('registrationModal').style.display = 'block';
    resetRegistrationForm();
}

function closeRegistrationModal() {
    document.getElementById('registrationModal').style.display = 'none';
}

function openPaymentModal() {
    document.getElementById('paymentModal').style.display = 'block';
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

function openInvoiceModal() {
    document.getElementById('invoiceModal').style.display = 'block';
}

function closeInvoiceModal() {
    document.getElementById('invoiceModal').style.display = 'none';
}

function openTicketPrintModal() {
    document.getElementById('ticketPrintModal').style.display = 'block';
}

function closeTicketPrintModal() {
    document.getElementById('ticketPrintModal').style.display = 'none';
}

function closeAllModals() {
    closeTicketModal();
    closeRegistrationModal();
    closePaymentModal();
    closeInvoiceModal();
    closeTicketPrintModal();
}

function changeQuantity(type, change) {
    ticketQuantities[type] = Math.max(0, ticketQuantities[type] + change);
    document.getElementById(`qty-${type}`).textContent = ticketQuantities[type];
    updateTicketSummary();
}

function updateTicketSummary() {
    const prices = {
        reguler: 25000,
        vip: 50000,
        premium: 75000
    };
    
    let totalTickets = 0;
    let totalPrice = 0;
    
    Object.keys(ticketQuantities).forEach(type => {
        const quantity = ticketQuantities[type];
        totalTickets += quantity;
        totalPrice += quantity * prices[type];
    });
    
    document.getElementById('totalTickets').textContent = totalTickets;
    document.getElementById('totalPrice').textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
}

function resetTicketForm() {
    ticketQuantities = { reguler: 0, vip: 0, premium: 0 };
    Object.keys(ticketQuantities).forEach(type => {
        document.getElementById(`qty-${type}`).textContent = 0;
    });
    updateTicketSummary();
    document.getElementById('ticketForm').reset();
}

function updateCompetitionSelection() {
    const checkboxes = document.querySelectorAll('input[name="competitions"]:checked');
    selectedCompetitions = Array.from(checkboxes).map(cb => cb.value);
    
    const prices = {
        monolog: 15000,
        tari: 25000,
        'paduan-suara': 30000
    };
    
    let totalPrice = 0;
    selectedCompetitions.forEach(comp => {
        totalPrice += prices[comp];
    });
    
    document.getElementById('selectedComps').textContent = selectedCompetitions.length;
    document.getElementById('totalRegPrice').textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    
    document.querySelectorAll('.competition-card').forEach(card => {
        const type = card.getAttribute('data-type');
        if (selectedCompetitions.includes(type)) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

function resetRegistrationForm() {
    selectedCompetitions = [];
    document.querySelectorAll('input[name="competitions"]').forEach(cb => {
        cb.checked = false;
    });
    updateCompetitionSelection();
    document.getElementById('registrationForm').reset();
}

function initializeForms() {
    document.querySelectorAll('input[name="competitions"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateCompetitionSelection);
    });
    
    document.querySelectorAll('.competition-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.type !== 'checkbox') {
                const checkbox = this.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                updateCompetitionSelection();
            }
        });
    });
    
    initializePhoneValidation();
    
    document.getElementById('ticketForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateTicketForm()) {
            processTicketPurchase();
        }
    });
    
    document.getElementById('registrationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateRegistrationForm()) {
            processRegistration();
        }
    });
}

function initializePhoneValidation() {
    const phoneInputs = ['buyerPhone', 'participantPhone'];
    
    phoneInputs.forEach(inputId => {
        const phoneInput = document.getElementById(inputId);
        if (phoneInput) {
            phoneInput.addEventListener('keydown', function(e) {
                if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
                    (e.keyCode === 65 && e.ctrlKey === true) ||
                    (e.keyCode === 67 && e.ctrlKey === true) ||
                    (e.keyCode === 86 && e.ctrlKey === true) ||
                    (e.keyCode === 88 && e.ctrlKey === true) ||
                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                    return;
                }
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });
            
            phoneInput.addEventListener('paste', function(e) {
                setTimeout(function() {
                    phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
                }, 1);
            });
            
            phoneInput.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9]/g, '');
            });
        }
    });
}

function validateTicketForm() {
    const totalTickets = Object.values(ticketQuantities).reduce((a, b) => a + b, 0);
    if (totalTickets === 0) {
        return false;
    }
    
    const requiredFields = ['buyerName', 'buyerEmail', 'buyerPhone'];
    for (let field of requiredFields) {
        const element = document.getElementById(field);
        if (!element.value.trim()) {
            element.focus();
            return false;
        }
    }
    
    const email = document.getElementById('buyerEmail').value;
    if (!isValidEmail(email)) {
        return false;
    }
    
    const phone = document.getElementById('buyerPhone').value;
    if (!isValidPhone(phone)) {
        document.getElementById('buyerPhone').focus();
        return false;
    }
    
    return true;
}

function validateRegistrationForm() {
    if (selectedCompetitions.length === 0) {
        return false;
    }
    
    const requiredFields = ['participantName', 'participantEmail', 'participantPhone', 'school', 'age', 'motivation'];
    for (let field of requiredFields) {
        const element = document.getElementById(field);
        if (!element.value.trim()) {
            element.focus();
            return false;
        }
    }
    
    const email = document.getElementById('participantEmail').value;
    if (!isValidEmail(email)) {
        return false;
    }
    
    const phone = document.getElementById('participantPhone').value;
    if (!isValidPhone(phone)) {
        document.getElementById('participantPhone').focus();
        return false;
    }
    
    const age = parseInt(document.getElementById('age').value);
    if (age < 13 || age > 25) {
        return false;
    }
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
}

function processTicketPurchase() {
    const buyerData = {
        name: document.getElementById('buyerName').value,
        email: document.getElementById('buyerEmail').value,
        phone: document.getElementById('buyerPhone').value,
        address: document.getElementById('buyerAddress').value,
        payment: document.querySelector('input[name="payment"]:checked').value
    };
    
    const prices = {
        reguler: 25000,
        vip: 50000,
        premium: 75000
    };
    
    let totalPrice = 0;
    let summaryDetails = '';
    
    Object.keys(ticketQuantities).forEach(type => {
        const quantity = ticketQuantities[type];
        if (quantity > 0) {
            const price = quantity * prices[type];
            totalPrice += price;
            summaryDetails += `<div class="summary-row">
                <span>${quantity}x Tiket ${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                <span>Rp ${price.toLocaleString('id-ID')}</span>
            </div>`;
        }
    });
    
    currentTransactionData = {
        type: 'ticket',
        data: buyerData,
        items: ticketQuantities,
        total: totalPrice,
        summary: summaryDetails
    };
    
    document.getElementById('paymentSummaryDetails').innerHTML = summaryDetails;
    document.getElementById('finalTotalPrice').textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    document.getElementById('paymentDescription').textContent = 'Pilih metode pembayaran';
    
    closeTicketModal();
    openPaymentModal();
    
    if (buyerData.payment === 'bank') {
        showBankPayment();
    } else {
        showQRISPayment();
    }
}

function processRegistration() {
    const participantData = {
        name: document.getElementById('participantName').value,
        email: document.getElementById('participantEmail').value,
        phone: document.getElementById('participantPhone').value,
        school: document.getElementById('school').value,
        age: document.getElementById('age').value,
        motivation: document.getElementById('motivation').value,
        payment: document.querySelector('input[name="regPayment"]:checked').value
    };
    
    const prices = {
        monolog: 15000,
        tari: 25000,
        'paduan-suara': 30000
    };
    
    const compNames = {
        monolog: 'Lomba Monolog',
        tari: 'Lomba Tari Kreasi',
        'paduan-suara': 'Lomba Paduan Suara'
    };
    
    let totalPrice = 0;
    let summaryDetails = '';
    
    selectedCompetitions.forEach(comp => {
        const price = prices[comp];
        totalPrice += price;
        summaryDetails += `<div class="summary-row">
            <span>${compNames[comp]}</span>
            <span>Rp ${price.toLocaleString('id-ID')}</span>
        </div>`;
    });
    
    currentTransactionData = {
        type: 'registration',
        data: participantData,
        competitions: selectedCompetitions,
        total: totalPrice,
        summary: summaryDetails
    };
    
    document.getElementById('paymentSummaryDetails').innerHTML = summaryDetails;
    document.getElementById('finalTotalPrice').textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    document.getElementById('paymentDescription').textContent = 'Selesaikan pembayaran pendaftaran';
    
    closeRegistrationModal();
    openPaymentModal();
    
    if (participantData.payment === 'bank') {
        showBankPayment();
    } else {
        showQRISPayment();
    }
}

function showBankPayment() {
    document.getElementById('bankPayment').style.display = 'block';
    document.getElementById('qrisPayment').style.display = 'none';
}

function showQRISPayment() {
    document.getElementById('bankPayment').style.display = 'none';
    document.getElementById('qrisPayment').style.display = 'block';
}

function selectBank(bankName) {
    document.querySelectorAll('.bank-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    event.target.closest('.bank-option').classList.add('selected');
}

function confirmPayment() {
    const invoiceNumber = 'INV-' + Date.now();
    const transactionDate = new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    let invoiceContent = '';
    
    if (currentTransactionData.type === 'ticket') {
        invoiceContent = `
            <div style="margin-top:5px; text-align:center;">
            <img src="/image/TIKET.png" alt="Bukti Pembayaran" style="max-width:400px;">
            </div>
        `;
    } else {
        invoiceContent = `
            <div style="margin-top:5px; text-align:center;">
            <img src="/image/TIKET.png" alt="Bukti Pembayaran" style="max-width:400px;">
            </div>
        `;
    }
    
    document.getElementById('invoiceDetails').innerHTML = invoiceContent;
    
    closePaymentModal();
    openInvoiceModal();
}

function printInvoice() {
    const invoiceContent = document.getElementById('invoiceDetails').innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(`
        ${invoiceContent}
    `);
    printWindow.document.close();
    printWindow.print();
}

function printTicket() {
    if (currentTransactionData.type === 'ticket') {
        openTicketPrintModal();
    }
}

function printActualTicket() {
    const ticketContent = document.getElementById('ticketDetails').innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(`
        ${ticketContent}
    `);
    printWindow.document.close();
    printWindow.print();
}