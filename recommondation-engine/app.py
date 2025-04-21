# pip install mysql.connector
import mysql.connector
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import logging
import random

def database():
    db_connection = mysql.connector.connect(
        host = "localhost",
        port = "3306",
        user = "root",
        database = "Marketplace"
    )
    return db_connection

def delete_user_recommendations(user_id):
    db_con = database()
    cursor = db_con.cursor()

    try:
        cursor.execute("DELETE FROM Recommendation WHERE UserID = %s", (user_id,))
        db_con.commit()
        print(f"Deleted existing recommendations for user {user_id}")
        logging.info(f"Deleted existing recommendations for user {user_id}")
        return True
    except Exception as e:
        logging.error(f"Error deleting recommendations for user {user_id}: {str(e)}")
        db_con.rollback()
        return False
    finally:
        cursor.close()
        db_con.close()

def get_random_products(count=10, exclude_list=None):
    """Get random products from the database, excluding any in the exclude_list"""
    db_con = database()
    cursor = db_con.cursor()

    try:
        if exclude_list and len(exclude_list) > 0:
            # Convert exclude_list to string for SQL IN clause
            exclude_str = ', '.join(map(str, exclude_list))
            cursor.execute(f"SELECT ProductID FROM Product WHERE ProductID NOT IN ({exclude_str}) ORDER BY RAND() LIMIT {count}")
        else:
            cursor.execute(f"SELECT ProductID FROM Product ORDER BY RAND() LIMIT {count}")

        random_products = [row[0] for row in cursor.fetchall()]
        return random_products

    except Exception as e:
        logging.error(f"Error getting random products: {str(e)}")
        return []
    finally:
        cursor.close()
        db_con.close()

def get_popular_products(count=10):
    """Get popular products based on history table frequency"""
    db_con = database()
    cursor = db_con.cursor()

    try:
        # Get products that appear most frequently in history
        cursor.execute("""
            SELECT ProductID, COUNT(*) as count
            FROM History
            GROUP BY ProductID
            ORDER BY count DESC
            LIMIT %s
        """, (count,))

        popular_products = [row[0] for row in cursor.fetchall()]

        # If not enough popular products, supplement with random ones
        if len(popular_products) < count:
            random_products = get_random_products(count - len(popular_products), popular_products)
            popular_products.extend(random_products)

        return popular_products

    except Exception as e:
        logging.error(f"Error getting popular products: {str(e)}")
        return get_random_products(count)  # Fallback to random products
    finally:
        cursor.close()
        db_con.close()

def has_user_history_or_recommendations(user_id):
    """Check if user exists in History or Recommendation table"""
    db_con = database()
    cursor = db_con.cursor()

    try:
        # Check if user has history
        cursor.execute("SELECT COUNT(*) FROM History WHERE UserID = %s", (user_id,))
        history_count = cursor.fetchone()[0]

        # Check if user has recommendations
        cursor.execute("SELECT COUNT(*) FROM Recommendation WHERE UserID = %s", (user_id,))
        recommendation_count = cursor.fetchone()[0]

        return history_count > 0 or recommendation_count > 0

    except Exception as e:
        logging.error(f"Error checking user history/recommendations: {str(e)}")
        return False
    finally:
        cursor.close()
        db_con.close()

def get_all_products():
    db_con = database()
    cursor = db_con.cursor()

    try:
        cursor.execute("SELECT CategoryID FROM Category")
        categories = cursor.fetchall()

        select_clause = "SELECT p.ProductID"
        for category in categories:
            category_id = category[0]
            select_clause += f", MAX(CASE WHEN pc.CategoryID = {category_id} THEN 1 ELSE 0 END) AS `Cat_{category_id}`"

        final_query = f"""
            {select_clause}
            FROM Product p
            LEFT JOIN Product_Category pc ON p.ProductID = pc.ProductID
            LEFT JOIN Category c ON pc.CategoryID = c.CategoryID
            GROUP BY p.ProductID;
            """

        cursor.execute(final_query)
        results = cursor.fetchall()

        final = []
        product_ids = []
        for row in results:
            text_list = list(row)
            product_id = text_list.pop(0)  # Save the product ID before removing it
            final.append(text_list)
            product_ids.append(product_id)

        cursor.close()
        db_con.close()
        return final, product_ids  # Return both feature vectors and product IDs
    except Exception as e:
        logging.error(f"Error getting all products: {str(e)}")
        cursor.close()
        db_con.close()
        return [], []

def get_user_history(user_id):
    db_con = database()
    cursor = db_con.cursor()

    try:
        cursor.execute("SELECT CategoryID FROM Category")
        categories = cursor.fetchall()

        select_clause = "SELECT p.ProductID"
        for category in categories:
            category_id = category[0] # get the uid of the category and then append that to the new column
            select_clause += f", MAX(CASE WHEN pc.CategoryID = {category_id} THEN 1 ELSE 0 END) AS `Cat_{category_id}`"

        final_query = f"""
            {select_clause}
            FROM Product p
            LEFT JOIN Product_Category pc ON p.ProductID = pc.ProductID
            LEFT JOIN Category c ON pc.CategoryID = c.CategoryID
            where p.ProductID in (select ProductID from History where UserID = {user_id})
            GROUP BY p.ProductID;
            """

        cursor.execute(final_query)
        results = cursor.fetchall()
        final = []
        for row in results:
            text_list = list(row)
            text_list.pop(0)
            final.append(text_list)

        cursor.close()
        db_con.close()
        return final
    except Exception as e:
        logging.error(f"Error getting user history: {str(e)}")
        cursor.close()
        db_con.close()
        return []

def get_recommendations(user_id, top_n=5):
    try:
        # Always delete existing recommendations first
        delete_user_recommendations(user_id)

        # Check if user has history or recommendations
        if not has_user_history_or_recommendations(user_id):
            # Cold start: return random products
            random_recs = get_random_products(top_n)
            # Store these random recommendations
            history_upload(user_id, random_recs)

            # Add 5 more unique random products
            additional_random = get_random_products(5, random_recs)
            history_upload(user_id, additional_random)

            return random_recs + additional_random

        # Get all products and user history with their category vectors
        all_product_features, all_product_ids = get_all_products()
        user_history = get_user_history(user_id)

        if not user_history:
            # User exists but has no history yet
            popular_recs = get_popular_products(top_n)
            history_upload(user_id, popular_recs)

            # Add 5 more unique random products
            additional_random = get_random_products(5, popular_recs)
            history_upload(user_id, additional_random)

            return popular_recs + additional_random

        # Calculate similarity between all products and user history
        user_profile = np.mean(user_history, axis=0)  # Average user preferences
        similarities = cosine_similarity([user_profile], all_product_features)
        print(similarities)

        # Get indices of the top N products sorted by similarity
        product_indices = similarities[0].argsort()[-top_n:][::-1]

        # Get the actual product IDs using the indices
        recommended_product_ids = [all_product_ids[i] for i in product_indices]

        # Upload the core recommendations to the database
        history_upload(user_id, recommended_product_ids)

        # Add 5 more unique random products that aren't in the recommendations
        additional_random = get_random_products(5, recommended_product_ids)
        history_upload(user_id, additional_random)

        # Return both the similarity-based recommendations and the random ones
        return recommended_product_ids + additional_random

    except Exception as e:
        logging.error(f"Recommendation error for user {user_id}: {str(e)}")
        # Fallback to random products
        random_products = get_random_products(top_n + 5)
        return random_products

def history_upload(userID, products):
    """Upload product recommendations to the database"""
    db_con = database()
    cursor = db_con.cursor()

    try:
        for product_id in products:
            # Use parameterized queries to prevent SQL injection
            cursor.execute("INSERT INTO Recommendation (UserID, RecommendedProductID) VALUES (%s, %s)",
                          (userID, product_id))

        # Commit the changes
        db_con.commit()

    except Exception as e:
        logging.error(f"Error uploading recommendations: {str(e)}")
        db_con.rollback()
    finally:
        # Close the cursor and connection
        cursor.close()
        db_con.close()
