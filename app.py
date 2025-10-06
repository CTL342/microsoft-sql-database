from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

users = {
    'temp': 'temptemp'
}

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

        if username in users and users[username] == password:
            return jsonify({
                'message': 'Login successful!',
                'user': {'username': username}
            }), 200
        else:
            return jsonify({'message': 'Invalid username or password'}), 401
    except Exception as e:
        print('Error in login route:', str(e))
        return jsonify({'message': 'Server error'}), 500

@app.route('/')
def serve_index():
    return render_template('index.html')

@app.route('/dashboard.html')
def serve_dashboard():
    return render_template('dashboard.html')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == "__main__":
    app.run(debug=True, port=5001)