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
Getting Started Locally
1. Clone the Repository
Bash
git clone https://github.com/Luther-123/personal-finace-tracker.git
cd "Personal Finance Tracker"
2. Set Up the Backend
Navigate to the backend directory, create a virtual environment, and install dependencies:

Bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
pip install -r requirements.txt
3. Run the FastAPI Server
Start the development server:

Bash
uvicorn main:app --reload
The backend API will run locally at http://127.0.0.1:8000.

4. Launch the Frontend
Open any of the HTML files inside the htmlfiles/ folder directly in your browser or serve them using a live server extension in VS Code to interact with the dashboard.