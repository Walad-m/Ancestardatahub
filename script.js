// ===== CORE CLASSES =====

// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.theme);
        this.setupEventListeners();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const icons = document.querySelectorAll('[data-theme-icon]');
        icons.forEach(icon => {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });
        localStorage.setItem('theme', theme);
        this.theme = theme;
    }

    toggle() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    setupEventListeners() {
        const toggleButtons = document.querySelectorAll('[data-action="toggle-theme"]');
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => this.toggle());
        });
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupActiveLinks();
    }

    setupMobileMenu() {
        const toggle = document.querySelector('[data-action="toggle-mobile-menu"]');
        const menu = document.querySelector('[data-mobile-menu]');
        const mobileActions = document.querySelector('[data-mobile-actions]');
        
        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                menu.classList.toggle('active');
                toggle.classList.toggle('active');
                
                if (window.innerWidth <= 768 && mobileActions) {
                    mobileActions.style.display = menu.classList.contains('active') ? 'flex' : 'none';
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                    menu.classList.remove('active');
                    toggle.classList.remove('active');
                    if (mobileActions && window.innerWidth <= 768) {
                        mobileActions.style.display = 'none';
                    }
                }
            });

            // Handle window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    menu.classList.remove('active');
                    toggle.classList.remove('active');
                    if (mobileActions) {
                        mobileActions.style.display = 'none';
                    }
                } else if (mobileActions) {
                    mobileActions.style.display = 'flex';
                }
            });

            // Set initial state
            if (window.innerWidth <= 768 && mobileActions) {
                mobileActions.style.display = 'flex';
            }
        }
    }

    setupSmoothScrolling() {
        const scrollLinks = document.querySelectorAll('[data-scroll-to]');
        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-scroll-to');
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// Authentication Management
class AuthManager {
    constructor() {
        this.user = JSON.parse(localStorage.getItem('user')) || null;
        this.init();
    }

    init() {
        this.updateUI();
        this.setupEventListeners();
    }

    updateUI() {
        const loginBtn = document.querySelector('a[href="login.html"]');
        const signupBtn = document.querySelector('a[href="signup.html"]');
        
        if (this.user && loginBtn && signupBtn) {
            loginBtn.textContent = 'Dashboard';
            loginBtn.href = 'dashboard.html';
            signupBtn.textContent = 'Logout';
            signupBtn.href = '#';
            signupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    async login(email, password) {
        try {
            await this.delay(1000);
            
            if (email && password) {
                const user = {
                    id: '1',
                    name: email.split('@')[0],
                    email: email,
                    balance: 250.00
                };
                
                localStorage.setItem('user', JSON.stringify(user));
                this.user = user;
                return { success: true };
            }
            
            return { success: false, message: 'Invalid credentials' };
        } catch (error) {
            return { success: false, message: 'Login failed' };
        }
    }

    async signup(name, email, password, confirmPassword) {
        try {
            if (password !== confirmPassword) {
                return { success: false, message: 'Passwords do not match' };
            }

            await this.delay(1000);
            
            if (name && email && password) {
                const user = {
                    id: '1',
                    name: name,
                    email: email,
                    balance: 0.00
                };
                
                localStorage.setItem('user', JSON.stringify(user));
                this.user = user;
                return { success: true };
            }
            
            return { success: false, message: 'Please fill all fields' };
        } catch (error) {
            return { success: false, message: 'Signup failed' };
        }
    }

    logout() {
        localStorage.removeItem('user');
        this.user = null;
        window.location.href = 'index.html';
    }

    requireAuth() {
        if (!this.user) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    setupEventListeners() {
        const loginForm = document.querySelector('[data-form="login"]');
        const signupForm = document.querySelector('[data-form="signup"]');

        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.querySelector('[data-field="email"]').value;
                const password = document.querySelector('[data-field="password"]').value;
                const submitBtn = document.querySelector('[data-submit="login"]');
                
                this.setButtonLoading(submitBtn, 'Signing In...');
                
                const result = await this.login(email, password);
                
                if (result.success) {
                    window.location.href = 'dashboard.html';
                } else {
                    this.showAlert(result.message, 'error');
                    this.resetButton(submitBtn, 'Sign In');
                }
            });
        }

        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.querySelector('[data-field="name"]').value;
                const email = document.querySelector('[data-field="email"]').value;
                const password = document.querySelector('[data-field="password"]').value;
                const confirmPassword = document.querySelector('[data-field="confirmPassword"]').value;
                const submitBtn = document.querySelector('[data-submit="signup"]');
                
                this.setButtonLoading(submitBtn, 'Creating Account...');
                
                const result = await this.signup(name, email, password, confirmPassword);
                
                if (result.success) {
                    window.location.href = 'dashboard.html';
                } else {
                    this.showAlert(result.message, 'error');
                    this.resetButton(submitBtn, 'Create Account');
                }
            });
        }
    }

    setButtonLoading(button, text) {
        button.disabled = true;
        button.innerHTML = `<i class="loading"></i> ${text}`;
    }

    resetButton(button, text) {
        button.disabled = false;
        button.innerHTML = text;
    }

    showAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        `;
        
        const form = document.querySelector('.form-card');
        if (form) {
            form.insertBefore(alert, form.firstChild);
            setTimeout(() => alert.remove(), 5000);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Data Management
class DataManager {
    constructor() {
        this.transactions = this.loadTransactions();
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    loadTransactions() {
        return JSON.parse(localStorage.getItem('transactions')) || [
            {
                id: 'TXN001',
                type: 'Data Purchase',
                network: 'MTN',
                amount: 15.00,
                status: 'completed',
                date: new Date().toISOString(),
                phone: '233542408856'
            },
            {
                id: 'TXN002',
                type: 'Wallet Deposit',
                amount: 100.00,
                status: 'completed',
                date: new Date(Date.now() - 86400000).toISOString()
            }
        ];
    }

    saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    addTransaction(transaction) {
        transaction.id = 'TXN' + Date.now();
        transaction.date = new Date().toISOString();
        this.transactions.unshift(transaction);
        this.saveTransactions();
    }

    setupEventListeners() {
        // Data purchase form
        const purchaseForm = document.querySelector('[data-form="purchase"]');
        if (purchaseForm) {
            purchaseForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleDataPurchase(e.target);
            });
        }

        // Deposit form
        const depositForm = document.querySelector('[data-form="deposit"]');
        if (depositForm) {
            depositForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleDeposit(e.target);
            });
        }

        // Network selection change
        const networkSelect = document.querySelector('[data-field="network"]');
        if (networkSelect) {
            networkSelect.addEventListener('change', (e) => {
                this.updateBundleOptions(e.target.value);
            });
        }

        // Bundle selection change
        const bundleSelect = document.querySelector('[data-field="bundle"]');
        if (bundleSelect) {
            bundleSelect.addEventListener('change', (e) => {
                this.updateAmountFromBundle(e.target.value);
            });
        }

        // Payment method change
        const methodSelect = document.querySelector('[data-field="method"]');
        if (methodSelect) {
            methodSelect.addEventListener('change', (e) => {
                this.showPaymentDetails(e.target.value);
            });
        }
    }

    async handleDataPurchase(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        const submitBtn = form.querySelector('[data-submit="purchase"]');
        
        this.setButtonLoading(submitBtn, 'Processing...');
        
        await this.delay(2000);
        
        this.addTransaction({
            type: 'Data Purchase',
            network: data.network,
            bundle: data.bundle,
            phone: data.phone,
            amount: parseFloat(data.amount),
            status: 'completed'
        });
        
        this.showAlert('Data purchase successful!', 'success');
        form.reset();
        this.resetButton(submitBtn, 'Purchase Data');
        
        setTimeout(() => {
            window.location.href = 'transactions.html';
        }, 2000);
    }

    async handleDeposit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        const submitBtn = form.querySelector('[data-submit="deposit"]');
        
        this.setButtonLoading(submitBtn, 'Processing...');
        
        await this.delay(2000);
        
        this.addTransaction({
            type: 'Wallet Deposit',
            method: data.method,
            amount: parseFloat(data.amount),
            status: 'completed'
        });
        
        this.showAlert('Deposit successful!', 'success');
        form.reset();
        this.resetButton(submitBtn, 'Deposit Now');
        
        // Update balance
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            user.balance += parseFloat(data.amount);
            localStorage.setItem('user', JSON.stringify(user));
        }
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }

    updateBundleOptions(network) {
        const bundleSelect = document.querySelector('[data-field="bundle"]');
        if (!bundleSelect) return;
        
        bundleSelect.innerHTML = '<option value="">Select Bundle</option>';
        
        if (network) {
            const bundles = {
                'MTN': [
                    { value: '1GB - ₵5', text: '1GB - ₵5' },
                    { value: '2GB - ₵10', text: '2GB - ₵10' },
                    { value: '5GB - ₵15', text: '5GB - ₵15' },
                    { value: '10GB - ₵25', text: '10GB - ₵25' }
                ],
                'AT': [
                    { value: '1GB - ₵6', text: '1GB - ₵6' },
                    { value: '2GB - ₵11', text: '2GB - ₵11' },
                    { value: '5GB - ₵16', text: '5GB - ₵16' },
                    { value: '10GB - ₵26', text: '10GB - ₵26' }
                ],
                'TELECEL': [
                    { value: '1GB - ₵5.50', text: '1GB - ₵5.50' },
                    { value: '2GB - ₵10.50', text: '2GB - ₵10.50' },
                    { value: '5GB - ₵15.50', text: '5GB - ₵15.50' },
                    { value: '10GB - ₵25.50', text: '10GB - ₵25.50' }
                ]
            };
            
            if (bundles[network]) {
                bundles[network].forEach(bundle => {
                    const option = document.createElement('option');
                    option.value = bundle.value;
                    option.textContent = bundle.text;
                    bundleSelect.appendChild(option);
                });
            }
        }
    }

    updateAmountFromBundle(bundleText) {
        const amountField = document.querySelector('[data-field="amount"]');
        if (!amountField) return;
        
        const amountMatch = bundleText.match(/₵(\d+(?:\.\d+)?)/);
        if (amountMatch) {
            amountField.value = amountMatch[1];
        }
    }

    showPaymentDetails(method) {
        const detailsContainer = document.querySelector('[data-payment-details]');
        if (!detailsContainer) return;
        
        if (method === 'mobile-money') {
            detailsContainer.innerHTML = `
                <div class="form-group">
                    <label for="transactionId" class="form-label">Transaction ID</label>
                    <input type="text" id="transactionId" name="transactionId" class="form-input" required 
                           placeholder="Enter MoMo transaction ID">
                    <small class="form-help-text">
                        Send money to 0542-408-856 and enter the transaction ID here
                    </small>
                </div>
            `;
            detailsContainer.classList.remove('payment-details-section');
            detailsContainer.style.display = 'block';
        } else if (method === 'bank-transfer') {
            detailsContainer.innerHTML = `
                <div class="form-group">
                    <label for="reference" class="form-label">Transfer Reference</label>
                    <input type="text" id="reference" name="reference" class="form-input" required 
                           placeholder="Enter bank transfer reference">
                    <small class="form-help-text">
                        Transfer to GCB Bank account and enter reference number
                    </small>
                </div>
            `;
            detailsContainer.style.display = 'block';
        } else if (method === 'credit-card') {
            detailsContainer.innerHTML = `
                <div class="info-container">
                    <i class="fas fa-info-circle" style="color: var(--primary-color); font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                    <p style="color: var(--text-secondary);">
                        Card payments are processed securely. You will be redirected to our payment processor.
                    </p>
                </div>
            `;
            detailsContainer.style.display = 'block';
        } else {
            detailsContainer.style.display = 'none';
        }
    }

    renderTransactions() {
        const container = document.querySelector('[data-transactions-container]');
        if (!container) return;

        const sampleTransactions = [
            { id: 'TXN001', type: 'Data Purchase', network: 'MTN', amount: 15.00, status: 'completed', date: '2025-01-08', icon: 'fas fa-shopping-cart' },
            { id: 'TXN002', type: 'Wallet Deposit', network: '-', amount: 100.00, status: 'completed', date: '2025-01-07', icon: 'fas fa-plus' },
            { id: 'TXN003', type: 'Data Purchase', network: 'AT', amount: 25.00, status: 'pending', date: '2025-01-07', icon: 'fas fa-shopping-cart' },
            { id: 'TXN004', type: 'Data Purchase', network: 'TELECEL', amount: 10.00, status: 'completed', date: '2025-01-06', icon: 'fas fa-shopping-cart' },
            { id: 'TXN005', type: 'AFA Registration', network: '-', amount: 50.00, status: 'failed', date: '2025-01-06', icon: 'fas fa-user-plus' }
        ];

        container.innerHTML = sampleTransactions.map(transaction => `
            <div class="transaction-card">
                <div class="transaction-header">
                    <div class="transaction-id">${transaction.id}</div>
                    <span class="status-badge status-${transaction.status}">
                        ${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                </div>
                <div class="transaction-details">
                    <div class="transaction-type">
                        <i class="${transaction.icon}"></i>
                        ${transaction.type}
                        ${transaction.network !== '-' ? `<span class="transaction-network">${transaction.network}</span>` : ''}
                    </div>
                    <div class="transaction-amount">₵${transaction.amount.toFixed(2)}</div>
                </div>
                <div class="transaction-footer">
                    <div class="transaction-date">${new Date(transaction.date).toLocaleDateString()}</div>
                    <button class="btn btn-outline btn-small" data-action="view-transaction" data-transaction-id="${transaction.id}">
                        <i class="fas fa-eye"></i>
                        <span class="btn-text">View</span>
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners for view buttons
        const viewButtons = container.querySelectorAll('[data-action="view-transaction"]');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const transactionId = e.target.closest('button').getAttribute('data-transaction-id');
                this.viewTransaction(transactionId);
            });
        });
    }

    viewTransaction(transactionId) {
        const modal = document.querySelector('[data-modal="transaction"]');
        const details = document.querySelector('[data-modal-content="transaction"]');
        
        if (!modal || !details) return;
        
        details.innerHTML = `
            <div class="modal-details-grid">
                <div><strong>Transaction ID:</strong> ${transactionId}</div>
                <div><strong>Type:</strong> Data Purchase</div>
                <div><strong>Network:</strong> MTN</div>
                <div><strong>Amount:</strong> ₵15.00</div>
                <div><strong>Phone Number:</strong> 0542-408-856</div>
                <div><strong>Status:</strong> <span class="status-badge status-success">Completed</span></div>
                <div><strong>Date:</strong> ${new Date().toLocaleString()}</div>
                <div><strong>Reference:</strong> MTN-${Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
            </div>
        `;
        
        modal.style.display = 'flex';
    }

    setButtonLoading(button, text) {
        button.disabled = true;
        button.innerHTML = `<i class="loading"></i> ${text}`;
    }

    resetButton(button, text) {
        button.disabled = false;
        button.innerHTML = text;
    }

    showAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            ${message}
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(alert, container.firstChild);
            setTimeout(() => alert.remove(), 5000);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ===== EVENT HANDLERS =====

// Dashboard specific handlers
class DashboardHandlers {
    constructor() {
        this.init();
    }

    init() {
        this.setupBuyDataSection();
        this.setupAFASection();
        this.setupQuickDeposit();
        this.setupModalHandlers();
    }

    setupBuyDataSection() {
        const showButtons = document.querySelectorAll('[data-action="show-buy-data"]');
        const hideButtons = document.querySelectorAll('[data-action="hide-buy-data"]');
        const section = document.querySelector('[data-section="buy-data"]');

        showButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (section) {
                    section.style.display = 'block';
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        hideButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (section) {
                    section.style.display = 'none';
                }
            });
        });
    }

    setupAFASection() {
        const showButtons = document.querySelectorAll('[data-action="show-afa"]');
        const hideButtons = document.querySelectorAll('[data-action="hide-afa"]');
        const section = document.querySelector('[data-section="afa"]');

        showButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (section) {
                    section.style.display = 'block';
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        hideButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (section) {
                    section.style.display = 'none';
                }
            });
        });
    }

    setupQuickDeposit() {
        const buttons = document.querySelectorAll('[data-action="set-deposit-amount"]');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const amount = button.getAttribute('data-amount');
                const amountField = document.querySelector('[data-field="amount"]');
                if (amountField) {
                    amountField.value = amount;
                }
            });
        });
    }

    setupModalHandlers() {
        const closeButtons = document.querySelectorAll('[data-action="close-modal"]');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Close modal when clicking outside
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }
}

// Service handlers for homepage
class ServiceHandlers {
    constructor() {
        this.init();
    }

    init() {
        this.setupServiceButtons();
    }

    setupServiceButtons() {
        const buyDataButtons = document.querySelectorAll('[data-action="buy-data"]');
        const registerAFAButtons = document.querySelectorAll('[data-action="register-afa"]');

        buyDataButtons.forEach(button => {
            button.addEventListener('click', () => {
                const network = button.getAttribute('data-network');
                const authManager = new AuthManager();
                if (authManager.user) {
                    sessionStorage.setItem('selectedNetwork', network);
                    window.location.href = 'dashboard.html#buy-data';
                } else {
                    window.location.href = 'login.html';
                }
            });
        });

        registerAFAButtons.forEach(button => {
            button.addEventListener('click', () => {
                const authManager = new AuthManager();
                if (authManager.user) {
                    window.location.href = 'dashboard.html#afa-registration';
                } else {
                    window.location.href = 'login.html';
                }
            });
        });
    }
}

// Transaction page handlers
class TransactionHandlers {
    constructor() {
        this.init();
    }

    init() {
        this.setupRefreshButton();
        this.setupExportButton();
    }

    setupRefreshButton() {
        const refreshButton = document.querySelector('[data-action="refresh-transactions"]');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                const icon = refreshButton.querySelector('i');
                if (icon) {
                    icon.style.animation = 'spin 1s linear';
                    setTimeout(() => {
                        icon.style.animation = '';
                        window.location.reload();
                    }, 1000);
                }
            });
        }
    }

    setupExportButton() {
        const exportButton = document.querySelector('[data-action="export-transactions"]');
        if (exportButton) {
            exportButton.addEventListener('click', () => {
                const csvContent = "Transaction ID,Type,Network,Amount,Status,Date\n" +
                    "TXN001,Data Purchase,MTN,15.00,Completed,2025-01-08\n" +
                    "TXN002,Wallet Deposit,-,100.00,Completed,2025-01-07";
                
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'transactions.csv';
                a.click();
                window.URL.revokeObjectURL(url);
            });
        }
    }
}

// ===== UTILITY FUNCTIONS =====

function scrollToServices() {
    const servicesSection = document.querySelector('#services');
    if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize core managers
    new ThemeManager();
    new NavigationManager();
    const authManager = new AuthManager();
    const dataManager = new DataManager();
    
    // Initialize page-specific handlers
    new DashboardHandlers();
    new ServiceHandlers();
    new TransactionHandlers();
    
    // Check authentication for protected pages
    const protectedPages = ['dashboard.html', 'deposit.html', 'transactions.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        authManager.requireAuth();
    }
    
    // Update dashboard if on dashboard page
    if (currentPage === 'dashboard.html' && authManager.user) {
        const userNameElement = document.querySelector('[data-user="name"]');
        const userBalanceElement = document.querySelector('[data-user="balance"]');
        
        if (userNameElement) userNameElement.textContent = authManager.user.name;
        if (userBalanceElement) userBalanceElement.textContent = `₵${authManager.user.balance.toFixed(2)}`;
    }
    
    // Render transactions if on transactions page
    if (currentPage === 'transactions.html') {
        dataManager.renderTransactions();
    }
    
    // Handle selected network for data purchase
    const selectedNetwork = sessionStorage.getItem('selectedNetwork');
    if (selectedNetwork && currentPage === 'dashboard.html') {
        const networkSelect = document.querySelector('[data-field="network"]');
        if (networkSelect) {
            networkSelect.value = selectedNetwork;
            dataManager.updateBundleOptions(selectedNetwork);
            sessionStorage.removeItem('selectedNetwork');
        }
    }
});

// Service Worker Registration (if needed for PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment if you add a service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}