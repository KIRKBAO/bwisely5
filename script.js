let totalSpent = parseFloat(localStorage.getItem('totalSpent')) || 0;
let spendingLimit = parseFloat(localStorage.getItem('spendingLimit')) || 0;
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

const totalDisplay = document.getElementById('total-spent');
const limitDisplay = document.getElementById('limit-display');
const transactionList = document.getElementById('transaction-list');

// Initialize App
updateUI();

function updateLimit() {
    const input = document.getElementById('limit-input');
    spendingLimit = parseFloat(input.value);
    localStorage.setItem('spendingLimit', spendingLimit);
    updateUI();
    input.value = '';
}

document.getElementById('pay-btn').addEventListener('click', () => {
    const merchant = document.getElementById('merchant-name').value;
    const amount = parseFloat(document.getElementById('amount-input').value);

    if (!merchant || isNaN(amount)) {
        alert("Please enter valid details");
        return;
    }

    // Spending Limit Logic
    if (totalSpent + amount > spendingLimit) {
        alert(" ERROR: Transaction declined! This exceeds your spending limit.");
        return;
    }

    // Process Transaction
    totalSpent += amount;
    const newTransaction = {
        name: merchant,
        price: amount,
        date: new Date().toLocaleTimeString()
    };

    transactions.unshift(newTransaction);
    saveAndRefresh();
});

function saveAndRefresh() {
    localStorage.setItem('totalSpent', totalSpent);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateUI();
    
    // Clear inputs
    document.getElementById('merchant-name').value = '';
    document.getElementById('amount-input').value = '';
}

function updateUI() {
    totalDisplay.innerText = `₱${totalSpent.toFixed(2)}`;
    limitDisplay.innerText = `₱${spendingLimit.toFixed(2)}`;
    
    transactionList.innerHTML = transactions.map(t => `
        <li class="transaction-item">
            <span><strong>${t.name}</strong><br><small>${t.date}</small></span>
            <span style="color: #d63031">-₱${t.price.toFixed(2)}</span>
        </li>
    `).join('');

    // Visual warning if close to limit
    if (totalSpent >= spendingLimit * 0.9 && spendingLimit > 0) {
        totalDisplay.style.color = "#fab1a0";
    }
}