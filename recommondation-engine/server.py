from flask import Flask, request, jsonify
from flask_cors import CORS
from app import get_recommendations


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/user/session', methods=['POST'])
def handle_session_data():
    try:
        data = request.get_json()
        user_id = data.get('userId')
        email = data.get('email')
        is_authenticated = data.get('isAuthenticated')

        if not user_id or not email or is_authenticated is None:
            return jsonify({'error': 'Invalid data'}), 400

        get_recommendations(user_id)

        print(f"Received session data: User ID: {user_id}, Email: {email}, Authenticated: {is_authenticated}")
        return jsonify({'message': 'Session data received successfully'})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
