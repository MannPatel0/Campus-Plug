
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

'''
Recommender system using content-based filtering
'''
class Recommender:
    def __init__(self):
        # Initialize data structures
        self.products_df = None
        self.user_profiles = {}
        self.tfidf_matrix = None
        self.tfidf_vectorizer = None
        self.product_indices = None
        
    def load_products(self, products_data):
        """
        Load product data into the recommender system
        
        products_data: list of dictionaries with product info (id, name, description, category, etc.)
        """
        self.products_df = pd.DataFrame(products_data)
        
        # Create a text representation for each product (combining various features)
        self.products_df['content'] = (
            self.products_df['category'] + ' ' + 
            self.products_df['name'] + ' ' + 
            self.products_df['description']
        )
        
        # Initialize TF-IDF vectorizer to convert text to vectors
        self.tfidf_vectorizer = TfidfVectorizer(
            stop_words='english',
            max_features=5000,  # Limit features to avoid sparse matrices
            ngram_range=(1, 2)  # Use both unigrams and bigrams
        )
        
        # Compute TF-IDF matrix
        self.tfidf_matrix = self.tfidf_vectorizer.fit_transform(self.products_df['content'])
        
        # Create a mapping from product_id to index
        self.product_indices = pd.Series(
            self.products_df.index, 
            index=self.products_df['product_id']
        ).drop_duplicates()
        
    def track_user_click(self, user_id, product_id):
        """
        Track user clicks on products to build user profiles
        """
        if user_id not in self.user_profiles:
            self.user_profiles[user_id] = {
                'clicks': {},
                'category_weights': {
                    'electronics': 0,
                    'school supplies': 0,
                    'rental place': 0,
                    'furniture': 0
                }
            }
        
        # Get the clicked product's index and details
        if product_id in self.product_indices:
            product_idx = self.product_indices[product_id]
            product_category = self.products_df.iloc[product_idx]['category']
            
            # Update click count
            if product_id in self.user_profiles[user_id]['clicks']:
                self.user_profiles[user_id]['clicks'][product_id] += 1
            else:
                self.user_profiles[user_id]['clicks'][product_id] = 1
            
            # Update category weight
            self.user_profiles[user_id]['category_weights'][product_category] += 1
    
    def get_user_profile_vector(self, user_id):
        """
        Generate a user profile vector based on their click history
        """
        if user_id not in self.user_profiles or not self.user_profiles[user_id]['clicks']:
            # Return a zero vector if no click history
            return np.zeros((1, self.tfidf_matrix.shape[1]))
        
        # Create a weighted average of all clicked products' TF-IDF vectors
        clicked_product_vectors = []
        weights = []
        
        for product_id, click_count in self.user_profiles[user_id]['clicks'].items():
            if product_id in self.product_indices:
                product_idx = self.product_indices[product_id]
                product_category = self.products_df.iloc[product_idx]['category']
                category_weight = self.user_profiles[user_id]['category_weights'][product_category]
                
                # Weight is based on both click count and category preference
                weight = click_count * (1 + 0.5 * category_weight)
                weights.append(weight)
                clicked_product_vectors.append(self.tfidf_matrix[product_idx])
        
        # Normalize weights
        weights = np.array(weights) / np.sum(weights)
        
        # Compute weighted average
        user_profile = np.zeros((1, self.tfidf_matrix.shape[1]))
        for i, vector in enumerate(clicked_product_vectors):
            user_profile += weights[i] * vector.toarray()
            
        return user_profile
    
    def recommend_products(self, user_id, n=5, category_filter=None):
        """
        Recommend products to a user based on their profile
        
        user_id: ID of the user
        n: Number of recommendations to return
        category_filter: Optional filter to limit recommendations to a specific category
        """
        # Get user profile vector
        user_profile = self.get_user_profile_vector(user_id)
        
        # If user has no profile, recommend popular products (not implemented)
        if np.sum(user_profile) == 0:
            return self._get_popular_products(n, category_filter)
        
        # Calculate similarity scores
        sim_scores = cosine_similarity(user_profile, self.tfidf_matrix)
        sim_scores = sim_scores.flatten()
        
        # Create a DataFrame for easier filtering
        recommendations_df = pd.DataFrame({
            'product_id': self.products_df['product_id'],
            'score': sim_scores,
            'category': self.products_df['category']
        })
        
        # Filter out products that the user has already clicked on
        if user_id in self.user_profiles and self.user_profiles[user_id]['clicks']:
            clicked_products = list(self.user_profiles[user_id]['clicks'].keys())
            recommendations_df = recommendations_df[~recommendations_df['product_id'].isin(clicked_products)]
        
        # Apply category filter if provided
        if category_filter:
            recommendations_df = recommendations_df[recommendations_df['category'] == category_filter]
        
        # Sort by similarity score and get top n recommendations
        recommendations_df = recommendations_df.sort_values('score', ascending=False).head(n)
        
        # Return recommended product IDs
        return recommendations_df['product_id'].tolist()
    
    def _get_popular_products(self, n=5, category_filter=None):
        """
        Return popular products when a user has no profile
        (This would typically be implemented with actual popularity metrics)
        """
        filtered_df = self.products_df
        
        if category_filter:
            filtered_df = filtered_df[filtered_df['category'] == category_filter]
        
        # Just return random products for now (in a real system you'd use popularity metrics)
        if len(filtered_df) >= n:
            return filtered_df.sample(n)['product_id'].tolist()
        else:
            return filtered_df['product_id'].tolist()

    def recommend_by_category_preference(self, user_id, n=5):
        """
        Recommend products based primarily on the user's category preferences
        """
        if user_id not in self.user_profiles:
            return self._get_popular_products(n)
        
        # Get the user's most clicked category
        category_weights = self.user_profiles[user_id]['category_weights']
        
        # If no category has been clicked, return popular products
        if sum(category_weights.values()) == 0:
            return self._get_popular_products(n)
        
        # Sort categories by number of clicks
        sorted_categories = sorted(
            category_weights.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        recommendations = []
        remaining = n
        
        # Allocate recommendations proportionally across categories
        for category, weight in sorted_categories:
            if weight > 0:
                # Allocate recommendations proportionally to category weight
                category_allocation = max(1, int(remaining * (weight / sum(category_weights.values()))))
                if category_allocation > remaining:
                    category_allocation = remaining
                
                # Get recommendations for this category
                category_recs = self.recommend_products(user_id, category_allocation, category)
                recommendations.extend(category_recs)
                
                # Update remaining slots
                remaining -= len(category_recs)
                
                if remaining <= 0:
                    break
        
        # If we still have slots to fill, add general recommendations
        if remaining > 0:
            general_recs = self.recommend_products(user_id, remaining)
            # Filter out duplicates
            general_recs = [rec for rec in general_recs if rec not in recommendations]
            recommendations.extend(general_recs[:remaining])
        
        return recommendations


exported = Recommender()
