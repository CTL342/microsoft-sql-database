Real-Time Cooling System SQL Dashboard

This project is a web-based dashboard that displays real-time data from a Microsoft SQL Server database. It uses a Flask backend to serve a web interface and provide an API, all while the SQL Server instance runs conveniently in a Docker container.

Project Overview

The application provides a simple user authentication system (signup/login). Once logged in, the user is presented with a dashboard that fetches and displays the most recent entry from the CoolingData table every second, simulating a real-time monitoring system.

Features

User Authentication: Secure signup and login functionality.

Real-Time Data Display: The main dashboard fetches and displays new data every second.

Containerized SQL Server: Uses a full-featured Microsoft SQL Server running in a Docker container for easy setup and portability.

Flask Backend: A lightweight Python-based web server to handle API requests and serve the front end.

Technology Stack

Backend: Flask (Python)

Database: Microsoft SQL Server (running in Docker)

Python Libraries: pyodbc, SQLAlchemy, pandas, Flask-Cors, python-dotenv, werkzeug

Frontend: HTML, CSS, JavaScript (served by Flask)

Prerequisites

Before you begin, ensure you have the following software installed on your system:

Python 3.8+: Download Python

Docker Desktop: Download Docker

Git: Download Git

A SQL Database GUI Tool (Choose one):

Azure Data Studio (Recommended, cross-platform)

Beekeeper Studio (Cross-platform)

SQL Server Management Studio (SSMS) (Windows-only)

Setup Instructions

Follow these steps to get the application running on your local machine.

1. Get the Project Files

First, clone the repository to your local machine.

git clone <your-repository-url>
cd <project-folder>


Next, create a file named requirements.txt in the root of your project folder and add the following lines:

Flask
pyodbc
python-dotenv
Flask-Cors
werkzeug
pandas
SQLAlchemy


2. Set Up Python Environment

It's highly recommended to use a virtual environment to manage your Python dependencies.

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
.\venv\Scripts\activate

# Install the required Python packages
pip install -r requirements.txt


3. Configure Environment Variables

Create a file named .env in the root of your project directory. This file will hold your database credentials. Do not commit this file to version control.

# .env file
SERVER=localhost
DATABASE=CoolingSystemDB
USERNAME=sa
PASSWORD=YourStrongP@ssw0rd!


⚠️ Important: The PASSWORD must meet SQL Server's complexity requirements (e.g., include uppercase, lowercase, numbers, and symbols). The one provided above is an example.

4. Start the SQL Server with Docker

Run the following command in your terminal to download and start the Microsoft SQL Server container. This command pulls the password directly from your .env file.

docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrongP@ssw0rd!" \
-p 1433:1433 --name sql_server_dashboard -d \
[mcr.microsoft.com/mssql/server:2022-latest](https://mcr.microsoft.com/mssql/server:2022-latest)


-p 1433:1433: Maps the container's SQL Server port to your local machine's port.

--name sql_server_dashboard: Gives the container a memorable name.

5. Install ODBC Drivers

The Python pyodbc library requires a system-level ODBC driver to communicate with SQL Server. Please follow the instructions for your operating system.

Option A: For Windows Users

Windows users can typically download the official Microsoft driver.

Go to the Microsoft ODBC Driver for SQL Server download page.

Download and install the latest "ODBC Driver 17 for SQL Server" (or newer).

Installing SQL Server Management Studio (SSMS) (linked in the prerequisites) often includes the necessary drivers as well.

Option B: For macOS / Linux Users

For macOS, the easiest way to install the drivers is via Homebrew.

# Install the core ODBC driver manager
brew install unixodbc

# Tap the Microsoft repository and install the official driver
brew tap microsoft/mssql-release [https://github.com/Microsoft/homebrew-mssql-release](https://github.com/Microsoft/homebrew-mssql-release)
brew install msodbcsql17


For Linux distributions, follow the official instructions on the Microsoft ODBC Driver for SQL Server download page.

6. Create and Populate the Database

Now you'll connect to your running SQL Server container and set up the database.

a. Connect with your Database Tool

Open your preferred SQL GUI (Azure Data Studio, Beekeeper Studio, or SSMS). Create a new connection with the following credentials:

Server / Hostname: localhost

Port: 1433 (this is the default)

Authentication Type: SQL Login

Username: sa

Password: YourStrongP@ssw0rd! (or whatever you set in your .env file)

b. Run SQL Setup Scripts

Once connected, open a new query editor and run the following SQL scripts one by one.

Script 1: Create the Database

CREATE DATABASE CoolingSystemDB;


Script 2: Create the users Table
(Ensure you are running this script against the CoolingSystemDB database you just created.)

USE CoolingSystemDB;
GO

-- Table for user accounts
CREATE TABLE users (
    username NVARCHAR(50) PRIMARY KEY,
    password NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    firstName NVARCHAR(100),
    lastName NVARCHAR(100),
    age INTEGER
);


c. Import the Kaggle Dataset

This step uses a Python script to automatically create the CoolingData table and upload the sample data.

Download the Dataset: Go to the Kaggle: Cooling Tower Optimization Dataset page.

Save the File: Download the cooling_tower_data.csv file and save it in the root of your project folder (the same directory as app.py).

Run the Import Script: In your terminal (with your virtual environment still active), run:

python import_kaggle_data.py


This script will connect to your database, create the CoolingData table, and upload all the data from the CSV. This may take a minute to complete.

Running the Application

You're all set! Follow these steps to launch the web application.

1. Start the SQL Server Container (if not running)

If you stopped your computer or the Docker container, you'll need to restart it.

docker start sql_server_dashboard


2. Start the Flask Web Server

Make sure your virtual environment is active.

# On macOS/Linux:
source venv/bin/activate
# On Windows:
.\venv\Scripts\activate

# Run the app
python app.py


3. Access the Application

Open your web browser and navigate to http://127.0.0.1:5001.

You will see the login page. You can create a new account via the signup page and then log in to view the real-time dashboard.

Acknowledgements

This project uses the Cooling Tower Optimization Dataset provided by Ziya on Kaggle.

Author: Ziya

Dataset: Cooling Tower Optimization Dataset

Source: Kaggle