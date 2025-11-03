# Real-Time Cooling System SQL Dashboard

This project is a web-based dashboard that displays real-time data from a Microsoft SQL Server database. It uses a Flask backend to serve a web interface and provide an API, with the SQL Server instance running in a Docker container for easy setup. It also now includes an integrated AI assistant, powered by a local Ollama model, to provide analysis and answer questions about the cooling system data.

## Features

- **User Authentication**: Secure signup and login functionality.
- **Real-Time Data Display**: Dashboard fetches and displays the latest entry from the `CoolingData` table every second.
- **Containerized SQL Server**: Uses Microsoft SQL Server in a Docker container for portability.
- **Flask Backend**: Lightweight Python-based web server to handle API requests and serve the frontend.
- **AI-Powered Chat**: An integrated chat interface (powered by Ollama and `gemma3`) that can answer questions about the cooling system and retrieve real-time data.

## Technology Stack

- **Backend**: Flask (Python), Ollama (for local LLM inference)
- **Database**: Microsoft SQL Server (Docker)
- **Python Libraries**: `pyodbc`, `SQLAlchemy`, `pandas`, `Flask-Cors`, `python-dotenv`, `werkzeug`, `ollama`
- **Frontend**: HTML, CSS, JavaScript (served by Flask)

## Prerequisites

Ensure the following software is installed:

- **Python 3.8+**: [Download Python](https://www.python.org/downloads/)
- **Docker Desktop**: [Download Docker](https://www.docker.com/products/docker-desktop/)
- **Git**: [Download Git](https://git-scm.com/downloads)
- **SQL Database GUI Tool** (choose one):
  - [Azure Data Studio](https://azure.microsoft.com/en-us/products/data-studio/) (recommended, cross-platform)
  - [Beekeeper Studio](https://www.beekeeperstudio.io/) (cross-platform)
  - [SQL Server Management Studio (SSMS)](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms) (Windows-only)
- **Ollama**: [Download Ollama](https://ollama.com/) (for running the local AI model)

## Setup Instructions

### 1. Get the Project Files

Clone the repository and navigate to the project folder:

```bash
git clone <your-repository-url>
cd <project-folder>
```

Create a `requirements.txt` file in the project root with the following:

```
Flask
pyodbc
python-dotenv
Flask-Cors
werkzeug
pandas
SQLAlchemy
```

### 2. Set Up Python Environment

Use a virtual environment to manage dependencies:

```bash
python3 -m venv venv
```

Activate the virtual environment:

- **macOS/Linux**:
  ```bash
  source venv/bin/activate
  ```
- **Windows**:
  ```bash
  .\venv\Scripts\activate
  ```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the project root with the following content. Do not commit this file to version control:

```
SERVER=localhost
DATABASE=CoolingSystemDB
USERNAME=sa
PASSWORD=YourStrongP@ssw0rd!
```

⚠️ **Important**: The `PASSWORD` must meet SQL Server's complexity requirements (uppercase, lowercase, numbers, symbols).

### 4. Start SQL Server with Docker

Run the following command to start the SQL Server container:

```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrongP@ssw0rd!" -p 1433:1433 --name sql_server_dashboard -d mcr.microsoft.com/mssql/server:2022-latest
```

- `-p 1433:1433`: Maps the container's SQL Server port to your local machine.
- `--name sql_server_dashboard`: Names the container.

### 5. Install ODBC Drivers

The `pyodbc` library requires an ODBC driver to connect to SQL Server.

#### Option A: Windows Users

- Download and install [ODBC Driver 17 for SQL Server](https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server).
- Installing SSMS often includes the necessary drivers.

#### Option B: macOS/Linux Users

For **macOS** (using Homebrew):

```bash
brew install unixodbc
brew tap microsoft/mssql-release https://github.com/Microsoft/homebrew-mssql-release
brew install msodbcsql17
```

For **Linux**, follow the [Microsoft ODBC Driver installation instructions](https://learn.microsoft.com/en-us/sql/connect/odbc/linux-mac/installing-the-microsoft-odbc-driver-for-sql-server).

### 6. Create and Populate the Database

#### a. Connect with Your Database Tool

Open your SQL GUI tool (Azure Data Studio, Beekeeper Studio, or SSMS) and create a connection:

- **Server/Hostname**: `localhost`
- **Port**: `1433`
- **Authentication Type**: SQL Login
- **Username**: `sa`
- **Password**: `YourStrongP@ssw0rd!` (or as set in `.env`)

#### b. Run SQL Setup Scripts

Run these scripts in your SQL GUI tool:

**Script 1: Create the Database**

```sql
CREATE DATABASE CoolingSystemDB;
```

**Script 2: Create the `users` Table**

Ensure you are using the `CoolingSystemDB` database:

```sql
USE CoolingSystemDB;
GO

CREATE TABLE users (
    username NVARCHAR(50) PRIMARY KEY,
    password NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    firstName NVARCHAR(100),
    lastName NVARCHAR(100),
    age INTEGER
);
```

#### c. Import the Kaggle Dataset

- Download the [Cooling Tower Optimization Dataset](https://www.kaggle.com/datasets/ziyaem/cooling-tower-optimization-dataset) from Kaggle.
- Save `cooling_tower_data.csv` in the project root.
- Run the import script (with virtual environment active):

```bash
python import_kaggle_data.py
```

This script creates the `CoolingData` table and uploads the CSV data.

### 7. Set Up and Run Ollama

This project uses a locally-run Ollama instance to power the AI chat feature.

1.  **Install Ollama**: Ensure you have installed [Ollama](https://ollama.com/) (from the Prerequisites).
2.  **Run the Ollama Service**: Launch the Ollama application. It must be running in the background for the chat feature to work.
3.  **Pull the AI Model**: The application is configured to use the `gemma3` model. Open your terminal and run:
    ```bash
    ollama pull gemma3
    ```

## Running the Application

Before starting the web server, ensure your two background services (SQL Server and Ollama) are running.

### 1. Start the SQL Server Container

If the container is stopped, restart it:

```bash
docker start sql_server_dashboard
```

### 2. Start the Ollama Service

Ensure the Ollama application (which you set up in Step 7) is running in the background.

### 3. Start the Flask Web Server

Ensure your virtual environment is active:

- **macOS/Linux**:
  ```bash
  source venv/bin/activate
  ```
- **Windows**:
  ```bash
  .\venv\Scripts\activate
  ```

Run the Flask app:

```bash
python app.py
```

### 4. Access the Application

Open your browser and navigate to `http://127.0.0.1:5001`. Use the signup page to create an account, then log in to view the real-time dashboard.

## Acknowledgements

This project uses the [Cooling Tower Optimization Dataset](https://www.kaggle.com/datasets/ziyaem/cooling-tower-optimization-dataset) by Ziya on Kaggle.

- **Author**: Ziya
- **Source**: Kaggle