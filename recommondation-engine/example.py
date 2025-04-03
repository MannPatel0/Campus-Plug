from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import mysql.connector as db_con

# Flask app initialization
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Database connection setup
def get_db_connection():
    return db_con.connect(
        host="localhost",
        port=3306,
        user="root",
        database="Marketplace"
    )

# Fetch all products with category names
def get_all_products():
    query = """
        SELECT p.ProductID, p.Name, p.Description, c.Name AS Category
        FROM Product p
        JOIN Category c ON p.CategoryID = c.CategoryID
    """

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(query)
        products = cursor.fetchall()
        cursor.close()
        connection.close()
        return products
    except Exception as e:
        print(f"Database error getting products: {e}")
        return []

# Fetch user history
def get_user_history(user_id):
    query = """
        SELECT p.ProductID, p.Name, p.Description, c.Name AS Category
        FROM History h
        JOIN Product p ON h.ProductID = p.ProductID
        JOIN Category c ON p.CategoryID = c.CategoryID
        WHERE h.UserID = %s
    """
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(query, (user_id,))
        history = cursor.fetchall()
        cursor.close()
        connection.close()
        return history
    except Exception as e:
        print(f"Error getting user history: {e}")
        return []

# Store recommendations
def store_user_recommendations(user_id, recommendations):
    delete_query = "DELETE FROM Recommendation WHERE UserID = %s"
    insert_query = "INSERT INTO Recommendation (UserID, RecommendedProductID) VALUES (%s, %s)"

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # First delete existing recommendations
        cursor.execute(delete_query, (user_id,))

        # Then insert new recommendations
        for product_id in recommendations:
            cursor.execute(insert_query, (user_id, product_id))

        connection.commit()
        cursor.close()
        connection.close()
        return True
    except Exception as e:
        print(f"Error storing recommendations: {e}")
        return False

# Fetch stored recommendations
def get_stored_recommendations(user_id):
    query = """
        SELECT p.ProductID, p.Name, p.Description, c.Name AS Category
        FROM Recommendation r
        JOIN Product p ON r.RecommendedProductID = p.ProductID
        JOIN Category c ON p.CategoryID = c.CategoryID
        WHERE r.UserID = %s
    """
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(query, (user_id,))
        recommendations = cursor.fetchall()
        cursor.close()
        connection.close()
        return recommendations
    except Exception as e:
        print(f"Error getting stored recommendations: {e}")
        return []

# Initialize Recommender class
class Recommender:
    def __init__(self):
        self.products_df = None
        self.tfidf_matrix = None
        self.tfidf_vectorizer = None
        self.product_indices = None

    def load_products(self, products_data):
        self.products_df = pd.DataFrame(products_data)

        # Combine relevant features for content-based filtering
        self.products_df['content'] = (
            self.products_df['Category'] + ' ' +
            self.products_df['Name'] + ' ' +
            self.products_df['Description'].fillna('')
        )

        # Create TF-IDF matrix
        self.tfidf_vectorizer = TfidfVectorizer(
            stop_words='english',
            max_features=5000,
            ngram_range=(1, 2)
        )
        self.tfidf_matrix = self.tfidf_vectorizer.fit_transform(self.products_df['content'])

        # Map product IDs to indices for quick lookup
        self.product_indices = pd.Series(
            self.products_df.index,
            index=self.products_df['ProductID']
        ).drop_duplicates()

    def recommend_products_for_user(self, user_id, top_n=40):
        """
        Generate product recommendations based on user history using cosine similarity
        """
        # Get user history
        user_history = get_user_history(user_id)

        # If no history, return popular products
        if not user_history:
            # In a real system, you might return popular products here
            return self.recommend_popular_products(top_n)

        # Convert user history to DataFrame
        history_df = pd.DataFrame(user_history)

        # Get indices of products in user history
        history_indices = []
        for product_id in history_df['ProductID']:
            if product_id in self.product_indices:
                history_indices.append(self.product_indices[product_id])

        if not history_indices:
            return self.recommend_popular_products(top_n)

        # Get TF-IDF vectors for user's history
        user_profile = self.tfidf_matrix[history_indices].mean(axis=0).reshape(1, -1)

        # Calculate similarity scores
        similarity_scores = cosine_similarity(user_profile, self.tfidf_matrix)
        similarity_scores = similarity_scores.flatten()

        # Create a Series with product indices and similarity scores
        product_scores = pd.Series(similarity_scores, index=self.products_df.index)

        # Remove products the user has already interacted with
        product_scores = product_scores.drop(history_indices)

        # Sort by similarity score (highest first)
        product_scores = product_scores.sort_values(ascending=False)

        # Get top N product indices
        top_indices = product_scores.iloc[:top_n].index

        # Get product IDs for these indices
        recommended_product_ids = self.products_df.iloc[top_indices]['ProductID'].tolist()

        return recommended_product_ids

    def recommend_popular_products(self, n=40):
        """
        Fallback recommendation strategy when user has no history
        In a real system, this would use actual popularity metrics
        """
        # For now, just returning random products
        return self.products_df.sample(min(n, len(self.products_df)))['ProductID'].tolist()

# Create recommender instance
recommender = Recommender()

@app.route('/load_products', methods=['GET'])
def load_products():
    products = get_all_products()
    if not products:
        return jsonify({'error': 'Failed to load products from database'}), 500

    recommender.load_products(products)
    return jsonify({'message': 'Products loaded successfully', 'count': len(products)})

@app.route('/recommend/<int:user_id>', methods=['GET'])
def recommend(user_id):
    # Check if products are loaded
    if recommender.products_df is None:
        products = get_all_products()
        if not products:
            return jsonify({'error': 'No products available'}), 500
        recommender.load_products(products)

    # Generate recommendations using cosine similarity
    recommendations = recommender.recommend_products_for_user(user_id)

    # Store recommendations in database
    if store_user_recommendations(user_id, recommendations):
        return jsonify({
            'userId': user_id,
            'recommendations': recommendations,
            'count': len(recommendations)
        })
    else:
        return jsonify({'error': 'Failed to store recommendations'}), 500

@app.route('/api/user/session', methods=['POST'])
def handle_session_data():
    try:
        data = request.get_json()
        print("Received data:", data)  # Debug print

        user_id = data.get('userId')
        email = data.get('email')
        is_authenticated = data.get('isAuthenticated')

        if not user_id or not email or is_authenticated is None:
            print("Missing required fields")  # Debug print
            return jsonify({'error': 'Invalid data'}), 400

        print(f"Processing session data: User ID: {user_id}, Email: {email}, Authenticated: {is_authenticated}")

        # Test database connection first
        try:
            conn = get_db_connection()
            conn.close()
            print("Database connection successful")
        except Exception as db_err:
            print(f"Database connection error: {db_err}")
            return jsonify({'error': f'Database connection error: {str(db_err)}'}), 500

        # Continue with the rest of your code...

    except Exception as e:
        import traceback
        print(f"Error in handle_session_data: {e}")
        print(traceback.format_exc())  # Print full stack trace
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    # Load products on startup
    products = get_all_products()
    if products:
        recommender.load_products(products)
        print(f"Loaded {len(products)} products at startup")
    else:
        print("Warning: No products loaded at startup")

    app.run(debug=True, host='0.0.0.0', port=5000)
