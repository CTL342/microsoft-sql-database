import os
from dotenv import load_dotenv
import pyodbc
from flask import Flask, request, jsonify, render_template, send_from_directory, g
from flask_cors import CORS
from datetime import datetime
from decimal import Decimal

app = Flask(__name__)
CORS(app)

load_dotenv()
server = os.getenv('SERVER')
database = os.getenv("DATABASE")
uid = os.getenv("USERNAME")
pid = os.getenv("PASSWORD")

def get_db_connection():
    conn_str = (
        f"DRIVER={{ODBC Driver 17 for SQL Server}};"
        f"SERVER={server};"
        f"DATABASE={database};"
        f"UID={uid};"
        f"PWD={pid};"
        f"TrustServerCertificate=yes;"
    )
    try:
        conn = pyodbc.connect(conn_str)
        return conn
    except pyodbc.Error as e:
        print(f"Database connection error: {e}")
        return None
    
def get_db():
    if 'db' not in g:
        g.db = get_db_connection()
    return g.db

@app.teardown_appcontext
def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

@app.route("/api/login", methods=['POST'])
def login():
    try:
        print('Received login request:', request.get_json())
        data = request.get_json()
        if data is None:
            print('No JSON data received')
            return jsonify({'message': 'Invalid request data'}), 400
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'message': 'Missing username or password'}), 400

        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT password FROM users WHERE username = ?", (username,))
        stored_password = cur.fetchone()

        if stored_password and stored_password[0] == password:
            return jsonify({
                'message': 'Login successful!',
                'user': {'username': username}
            }), 200
        else:
            return jsonify({'message': 'Invalid username or password'}), 401
    except Exception as e:
        print('Error in login route:', str(e))
        return jsonify({'message': 'Server error'}), 500

@app.route("/api/signup", methods=['POST'])
def signup():
    conn = get_db()
    try:
        print('Received signup request:', request.get_json())
        data = request.get_json()
        if data is None:
            print('No JSON data received')
            return jsonify({'message': 'Invalid request data'}), 400
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        firstName = data.get('firstName')
        lastName = data.get('lastName')
        age = data.get('age')

        if not all([username, password, email, firstName, lastName, age]):
            return jsonify({'message': 'Missing required fields'}), 400

        cur = conn.cursor()
        cur.execute("SELECT username FROM users WHERE username = ?", (username,))
        if cur.fetchone():
            return jsonify({'message': 'Username already exists'}), 400

        cur.execute("""
            INSERT INTO users (username, password, email, firstName, lastName, age)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (username, password, email, firstName, lastName, int(age)))
        conn.commit()
        return jsonify({'message': 'Signup successful!'}), 201
    except Exception as e:
        print('Error in signup route:', str(e))
        return jsonify({'message': 'Server error'}), 500

@app.route("/api/latest_entry", methods=['GET'])
def get_latest_entry():
    try:
        conn = get_db()
        if not conn:
            print("!!! FATAL: get_db() returned None in latest_entry.")
            return jsonify({'error': 'Database connection could not be established.'}), 500

        cur = conn.cursor()
        print("--- Executing query for latest entry ---")
        cur.execute("SELECT TOP 1 * FROM CoolingData ORDER BY Timestamp DESC;")
        row = cur.fetchone()

        if not row:
            print("--- Query successful, but no data found in CoolingData table. ---")
            return jsonify({'latest_entry': None})

        print("--- Row found, processing for JSON serialization. ---")
        columns = [column[0] for column in cur.description]
        raw_entry = dict(zip(columns, row))

        latest_entry_serializable = {}
        for key, value in raw_entry.items():
            if isinstance(value, datetime):
                latest_entry_serializable[key] = value.isoformat()
            elif isinstance(value,(Decimal, float)):
                latest_entry_serializable[key] = f"{value:.2f}"
            elif value is None:
                latest_entry_serializable[key] = None
            else:
                latest_entry_serializable[key] = str(value)
        
        print("--- Serialization successful, returning data. ---")
        return jsonify({'latest_entry': latest_entry_serializable})

    except pyodbc.Error as e:
        error_message = f"SQL Error: {e}"
        print(f"!!! {error_message} !!!")
        return jsonify({'error': error_message}), 500
        
    except Exception as e:
        error_message = f"An unexpected error occurred: {e}"
        print(f"!!! {error_message} !!!")
        return jsonify({'error': error_message}), 500

@app.route('/')
def serve_index():
    return render_template('index.html')

@app.route('/signup.html')
def serve_signup():
    return render_template('signup.html')

@app.route('/terms.html')
def serve_terms():
    return render_template('terms.html')

@app.route('/dashboard.html')
def serve_dashboard():
    return render_template('dashboard.html')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == "__main__":
    app.run(debug=True, port=5001)