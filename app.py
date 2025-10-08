from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect("SSD.db", check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_user_db():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DROP TABLE IF EXISTS users")
    cur.execute("""
        CREATE TABLE users (
            username TEXT PRIMARY KEY,
            password TEXT,
            email TEXT,
            firstName TEXT,
            lastName TEXT,
            age INTEGER
        )
    """)
    conn.commit()
    conn.close()

if not os.path.exists("SSD.db") or os.path.getsize("SSD.db") == 0:
    init_user_db()

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

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT password FROM users WHERE username = ?", (username,))
        stored_password = cur.fetchone()
        conn.close()

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
    conn = get_db_connection()
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

        # Validate all required fields
        if not all([username, password, email, firstName, lastName, age]):
            return jsonify({'message': 'Missing required fields'}), 400

        cur = conn.cursor()
        cur.execute("SELECT username FROM users WHERE username = ?", (username,))
        if cur.fetchone():
            return jsonify({'message': 'Username already exists'}), 400

        # Insert with all fields
        cur.execute("""
            INSERT INTO users (username, password, email, firstName, lastName, age)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (username, password, email, firstName, lastName, int(age)))
        conn.commit()
        return jsonify({'message': 'Signup successful!'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Username already exists'}), 400
    except Exception as e:
        print('Error in signup route:', str(e))
        conn.rollback()
        return jsonify({'message': 'Server error'}), 500
    finally:
        conn.close()

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