document.addEventListener('DOMContentLoaded', () => {
    // 1. Highlight active page in sidebar
    const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-links a').forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 2. Modal Toggle Logic
    const modal = document.getElementById('cardModal');
    const openBtn = document.getElementById('openCardModalBtn');
    const closeBtn = document.getElementById('closeCardModalBtn');
    const cardForm = document.getElementById('cardForm');

    if (openBtn && modal) openBtn.addEventListener('click', () => modal.style.display = 'flex');
    if (closeBtn && modal) closeBtn.addEventListener('click', () => modal.style.display = 'none');

    // Initial card collection state
    let cards = [
        { brand: 'VISA', number: '3210 **** **** 7890', holder: 'Luther Makori', expires: '08/28', tag: 'Primary', background: '#0f172a' },
        { brand: 'MASTERCARD', number: '9841 **** **** 1234', holder: 'Luther Makori', expires: '12/29', tag: 'Virtual', background: '#2563eb' }
    ];

    function renderCards() {
        const container = document.getElementById('cardsListContainer');
        if (!container) return;

        container.innerHTML = '';

        cards.forEach((cardData, index) => {
            const cardEl = document.createElement('div');
            // Replicating your sleek card visual style
            cardEl.style.cssText = `
                background: ${cardData.background};
                color: #ffffff;
                border-radius: 16px;
                padding: 24px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 180px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                position: relative;
                font-family: inherit;
            `;

            cardEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 700; letter-spacing: 1px; font-size: 15px;">${cardData.brand}</span>
                    <span style="font-size: 11px; background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 12px; font-weight: 600;">${cardData.tag}</span>
                </div>
                <div style="font-size: 18px; letter-spacing: 2px; font-weight: 600; margin: 15px 0;">
                    ${cardData.number}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 12px;">
                    <div>
                        <p style="color: #94a3b8; font-size: 10px; text-transform: uppercase; margin-bottom: 2px;">Cardholder</p>
                        <p style="font-weight: 500;">${cardData.holder}</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="color: #94a3b8; font-size: 10px; text-transform: uppercase; margin-bottom: 2px;">Expires</p>
                        <p style="font-weight: 500;">${cardData.expires}</p>
                    </div>
                </div>
            `;
            container.appendChild(cardEl);
        });
    }

    // 3. Handle Form Submission
    if (cardForm) {
        cardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const brand = document.getElementById('cardBrand').value.toUpperCase();
            const number = document.getElementById('cardNum').value;
            const expires = document.getElementById('cardExpiry').value;
            const tag = document.getElementById('cardTypeLabel').value;

            // Alternates background color theme based on brand style
            const background = brand.includes('VISA') ? '#0f172a' : '#2563eb';

            cards.push({
                brand,
                number,
                holder: 'Luther Makori',
                expires,
                tag,
                background
            });

            renderCards();
            cardForm.reset();
            modal.style.display = 'none';
        });
    }

    renderCards();
});