document.addEventListener('DOMContentLoaded', async () => {
    // 1. Highlight active navigation link
    const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-links a').forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 2. Modal Toggle Logic
    const modal = document.getElementById('accountModal');
    const openBtn = document.getElementById('openAccountModalBtn');
    const closeBtn = document.getElementById('closeAccountModalBtn');
    const accountForm = document.getElementById('accountForm');

    if (openBtn && modal) openBtn.addEventListener('click', () => modal.style.display = 'flex');
    if (closeBtn && modal) closeBtn.addEventListener('click', () => modal.style.display = 'none');

    // 3. Fetch live data and render accounts
    async function loadAccounts() {
        try {
            // If you have a dedicated accounts endpoint, fetch that. Otherwise, derive from transactions or local storage.
            const response = await fetch('http://127.0.0.1:8000/api/transactions');
            if (!response.ok) throw new Error('Failed to fetch data');

            const transactions = await response.json();

            // Calculate dynamic totals from transaction ledger
            let totalIncome = transactions.filter(t => t.type === 'positive').reduce((acc, t) => acc + Number(t.amount), 0);
            let totalSpendings = transactions.filter(t => t.type === 'negative').reduce((acc, t) => acc + Number(t.amount), 0);

            // Dynamic live accounts calculation
            let accounts = [
                { id: 1, title: 'Visa Checking Account', account_number: '3210 **** **** 7890', balance: 420200.00 + totalIncome - totalSpendings, status: 'Active' },
                { id: 2, title: 'Savings Vault', account_number: '9841 **** **** 1234', balance: 122237.43, status: 'Active' }
            ];

            const container = document.getElementById('accountsListContainer');
            const netWorthEl = document.getElementById('totalNetWorth');
            if (!container) return;

            container.innerHTML = '';
            let totalNetWorth = 0;

            accounts.forEach(acc => {
                totalNetWorth += Number(acc.balance);

                const card = document.createElement('div');
                card.style.cssText = 'background: #ffffff; border-radius: 12px; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #f1f5f9; box-shadow: 0 2px 8px rgba(0,0,0,0.02);';

                card.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <div style="width: 44px; height: 44px; background: #1e40af; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px;">
                            ${acc.title.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h4 style="font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 2px;">${acc.title}</h4>
                            <p style="font-size: 13px; color: #64748b;">${acc.account_number}</p>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 2px;">Kes ${Number(acc.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        <span style="font-size: 12px; font-weight: 600; color: #10b981;">${acc.status}</span>
                    </div>
                `;
                container.appendChild(card);
            });

            if (netWorthEl) {
                netWorthEl.textContent = `Kes ${totalNetWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
            }
        } catch (error) {
            console.error("Error loading accounts:", error);
        }
    }

    await loadAccounts();
});