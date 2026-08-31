# Personal Finance Tracker

A full-stack personal finance and asset tracking application designed to monitor net worth, visualize spending habits through dynamic SVG graphics, and manage multi-account portfolios.

## Tech Stack

* **Backend**: FastAPI (Python), SQLite, SQLAlchemy
* **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3, SVG
* **Architecture**: RESTful API design with a modular separation of concerns between backend services and frontend pages.

## Key Features

* **Real-Time Financial Dashboard**: Aggregates net worth, dynamic income, and total spendings with interactive data updates.
* **Dynamic SVG Visualizations**: Automatically computes database transaction volumes and renders proportional asset donut charts on the fly.
* **Multi-Page Asset Management**: 
  * **Accounts**: View active balances across checking and savings accounts with net worth calculations.
  * **Cards**: Manage primary and virtual payment cards with customized themes.
  * **Transactions**: Log, filter, and view detailed financial history categorized by date.
* **Data Portability**: Built-in CSV export functionality allowing users to instantly download their complete financial transaction ledger.
* **Modal-Driven Workflows**: Clean, responsive user inputs for adding new accounts, cards, and transactions without page reloads.

## Project Structure

```text
PERSONAL FINANCE TRACKER/
├── backend/
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   └── requirements.txt
├── htmlfiles/
│   ├── index.html
│   ├── accounts.html
│   ├── cards.html
│   └── transactions.html
├── javascriptfiles/
│   ├── script.js
│   ├── accounts.js
│   ├── cards.js
│   └── transactions.js
├── style.css
└── .gitignore