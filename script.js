document.addEventListener("DOMContentLoaded", function () {
    const balanceEl = document.getElementById("balance");
    const incomeEl = document.getElementById("income");
    const expenseEl = document.getElementById("expense");
    const transactionForm = document.getElementById("transaction-form");
    const transactionList = document.getElementById("transaction-list");

    // Filter elements
    const filterType = document.getElementById("filter-type");
    const minAmount = document.getElementById("min-amount");
    const maxAmount = document.getElementById("max-amount");
    const searchInput = document.getElementById("search");
    const applyFiltersBtn = document.getElementById("apply-filters");

    let transactions = [];

    // Function to update UI
    function updateUI(filteredTransactions = transactions) {
        let income = 0;
        let expense = 0;
        let balance = 0;

        transactionList.innerHTML = "";

        filteredTransactions.forEach((transaction, index) => {
            const li = document.createElement("li");
            li.textContent = `${transaction.description}: $${transaction.amount}`;
            li.classList.add(transaction.type === "income" ? "income-item" : "expense-item");

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "X";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.onclick = function () {
                transactions.splice(index, 1);
                updateUI();
            };

            li.appendChild(deleteBtn);
            transactionList.appendChild(li);

            if (transaction.type === "income") {
                income += transaction.amount;
            } else {
                expense += transaction.amount;
            }
        });

        balance = income - expense;

        balanceEl.textContent = balance;
        incomeEl.textContent = income;
        expenseEl.textContent = expense;
    }

    // Function to add transaction
    transactionForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const description = document.getElementById("description").value;
        const amount = parseFloat(document.getElementById("amount").value);
        const type = document.getElementById("type").value;

        if (!description || isNaN(amount) || amount <= 0) {
            alert("Please enter a valid description and amount");
            return;
        }

        transactions.push({ description, amount, type });
        updateUI();

        transactionForm.reset();
    });

    // Function to apply filters
    function applyFilters() {
        let filteredTransactions = transactions;

        const selectedType = filterType.value;
        const minVal = parseFloat(minAmount.value);
        const maxVal = parseFloat(maxAmount.value);
        const searchText = searchInput.value.toLowerCase();

        // Filter by type
        if (selectedType !== "all") {
            filteredTransactions = filteredTransactions.filter(tran => tran.type === selectedType);
        }

        // Filter by amount range
        if (!isNaN(minVal)) {
            filteredTransactions = filteredTransactions.filter(tran => tran.amount >= minVal);
        }
        if (!isNaN(maxVal)) {
            filteredTransactions = filteredTransactions.filter(tran => tran.amount <= maxVal);
        }

        // Filter by search term
        if (searchText) {
            filteredTransactions = filteredTransactions.filter(tran =>
                tran.description.toLowerCase().includes(searchText)
            );
        }

        updateUI(filteredTransactions);
    }

    // Attach event listener to filter button
    applyFiltersBtn.addEventListener("click", applyFilters);

    updateUI(); // Initialize UI with empty transactions
});
