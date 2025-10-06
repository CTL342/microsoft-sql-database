from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

users = {
    'temp': 'temptemp'
}

@app.route("/api/login", methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Missing username or password'}), 400

    if username in users and users[username] == password:
        return jsonify({
            'message': 'Login successful!',
            'user': {'username': username}
        }), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

@app.route('/')
def serve_index():
    return render_template('index.html')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == "__main__":
    app.run(debug=True)