document.addEventListener('DOMContentLoaded', async () => {
    // 1. Highlight current active page in sidebar automatically based on URL
    const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.sidebar-links a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 2. Modal Toggle Logic
    const modal = document.getElementById('transactionModal');
    const actionBtn = document.querySelector('.action-btn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const transactionForm = document.getElementById('transactionForm');

    function openModal() {
        if (modal) modal.style.display = 'flex';
    }

    function closeModal() {
        if (modal) modal.style.display = 'none';
    }

    if (actionBtn) actionBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

    // 3. Central Data Fetch & UI Synchronization
    async function loadDashboardData() {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/transactions');
            if (!response.ok) throw new Error('Failed to fetch transactions');

            const transactions = await response.json();

            // Sort descending by ID/date so newest are on top
            transactions.sort((a, b) => b.id - a.id);

            renderTransactionsList(transactions);
            renderAssetBarChart(transactions);
            updateSummaryCards(transactions);
        } catch (error) {
            console.error("Backend server offline or unreachable:", error);
        }
    }

    // 4. Render Transaction List Widget
    function renderTransactionsList(transactions) {
        const container = document.querySelector('.transaction-card .date-group') || document.querySelector('.date-group');
        if (!container) return;

        container.innerHTML = '';

        const grouped = {};
        transactions.forEach(tx => {
            const dateKey = tx.date.includes(',') ? tx.date.split(',')[0].trim() : tx.date;
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(tx);
        });

        for (const [date, txs] of Object.entries(grouped)) {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'date-group';

            const dateLabel = document.createElement('div');
            dateLabel.className = 'group-date';
            dateLabel.textContent = date;
            groupDiv.appendChild(dateLabel);

            txs.forEach(tx => {
                const isPositive = tx.type === 'positive';
                const amountClass = isPositive ? 'positive' : 'negative';
                const formattedAmount = `${isPositive ? '+' : '-'}Kes ${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

                const item = document.createElement('div');
                item.className = 'transaction-item';
                item.innerHTML = `
                    <div class="item-icon bg-blue">${tx.title.charAt(0).toUpperCase()}</div>
                    <div class="item-details">
                        <p class="item-title">${tx.title}</p>
                        <p class="item-time">${tx.date}</p>
                    </div>
                    <div class="item-amount ${amountClass}">${formattedAmount}</div>
                `;
                groupDiv.appendChild(item);
            });

            container.appendChild(groupDiv);
        }
    }

    // 5. Update Summary Cards & Balance
    function updateSummaryCards(transactions) {
        let totalIncome = 0;
        let totalSpendings = 0;

        transactions.forEach(tx => {
            if (tx.type === 'positive') {
                totalIncome += Number(tx.amount);
            } else {
                totalSpendings += Number(tx.amount);
            }
        });

        const incomeEl = document.getElementById('totalIncome');
        const spendingsEl = document.getElementById('totalSpendings');
        const totalBalanceEl = document.getElementById('totalBalance');
        const accountBalanceEl = document.getElementById('accountBalance');

        if (incomeEl) incomeEl.textContent = `Kes ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
        if (spendingsEl) spendingsEl.textContent = `Kes ${totalSpendings.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

        const baseBalance = 500000;
        const netBalance = baseBalance + totalIncome - totalSpendings;

        if (totalBalanceEl) {
            totalBalanceEl.textContent = `Kes ${netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
        }
        if (accountBalanceEl) {
            accountBalanceEl.textContent = `Kes ${netBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    }

    // 6. Render Dynamic Bar Chart
    // 6. Render Dynamic Donut Chart
    function renderAssetBarChart(transactions) {
        const donutGroup = document.getElementById('donutSegments');
        const centerTotalEl = document.getElementById('donutCenterTotal');
        if (!donutGroup) return;

        donutGroup.innerHTML = '';

        if (transactions.length === 0) {
            if (centerTotalEl) centerTotalEl.textContent = 'Kes 0';
            return;
        }

        // Group transaction volumes by category/title
        const categoryTotals = {};
        let grandTotal = 0;

        transactions.forEach(tx => {
            const absVal = Math.abs(tx.amount);
            grandTotal += absVal;
            const key = tx.title.length > 10 ? tx.title.substring(0, 10) + '...' : tx.title;
            categoryTotals[key] = (categoryTotals[key] || 0) + absVal;
        });

        if (centerTotalEl) {
            centerTotalEl.textContent = `Kes ${grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
        }

        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        let accumulatedOffset = 0;

        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
        let colorIndex = 0;

        Object.entries(categoryTotals).slice(0, 4).forEach(([category, amount]) => {
            const percentage = amount / grandTotal;
            const strokeLength = percentage * circumference;

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', '60');
            circle.setAttribute('cy', '60');
            circle.setAttribute('r', radius);
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', colors[colorIndex % colors.length]);
            circle.setAttribute('stroke-width', '14');
            circle.setAttribute('stroke-dasharray', `${strokeLength} ${circumference - strokeLength}`);
            circle.setAttribute('stroke-dashoffset', -accumulatedOffset);

            donutGroup.appendChild(circle);

            accumulatedOffset += strokeLength;
            colorIndex++;
        });
    }

    // 7. Handle Form Submission via POST request
    if (transactionForm) {
        transactionForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const newTx = {
                title: document.getElementById('title').value,
                amount: parseFloat(document.getElementById('amount').value),
                type: document.getElementById('type').value,
                date: document.getElementById('date').value
            };

            try {
                const response = await fetch('http://127.0.0.1:8000/api/transactions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newTx)
                });

                if (response.ok) {
                    closeModal();
                    transactionForm.reset();
                    await loadDashboardData(); // Refresh all live dashboard components instantly
                } else {
                    console.error("Failed to save transaction");
                }
            } catch (error) {
                console.error("Error submitting transaction:", error);
            }
        });
    }

    // 8. CSV Export Mechanics
    const exportCsvBtn = document.getElementById('exportCsvBtn');

    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/transactions');
                if (!response.ok) throw new Error('Failed to fetch transactions');

                const transactions = await response.json();

                if (transactions.length === 0) {
                    alert('No transactions available to export.');
                    return;
                }

                let csvContent = "data:text/csv;charset=utf-8,ID,Title,Amount (Kes),Type,Date\n";

                transactions.forEach(tx => {
                    const row = [tx.id, `"${tx.title}"`, tx.amount, tx.type, `"${tx.date}"`];
                    csvContent += row.join(",") + "\n";
                });

                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "transactions_export.csv");
                document.body.appendChild(link);

                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error("Error exporting CSV:", error);
                alert("Could not export transactions. Check backend connection.");
            }
        });
    }

    // Initial load execution on page boot
    await loadDashboardData();
});