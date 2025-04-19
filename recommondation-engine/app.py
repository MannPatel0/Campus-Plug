# pip install mysql.connector
import mysql.connector
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import logging
from unittest import result

def database():
    db_connection = mysql.connector.connect(
        host = "localhost",
        port = "3306",
        user = "root",
        database = "Marketplace"
    )
    return db_connection

def get_popular_products():
    pass


def delete_user_recommendation(userID, Array):
    db_con = database()
    cursor = db_con.cursor()

    try:
        for item in Array:
            #Product ID starts form index 1
            item_value = item + 1
            print(item_value)
            # Use parameterized queries to prevent SQL injection
            cursor.execute(f"INTO Recommendation (UserID, RecommendedProductID) VALUES ({userID}, {item_value});")

        db_con.commit()

        #results = cursor.fetchall()
        #print(results)
    except:
        pass

def get_all_products():

    db_con = database()
    cursor = db_con.cursor()

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
    for row in results:
        text_list = list(row)
        text_list.pop(0)
        final.append(text_list)

    cursor.close()
    db_con.close()
    return final

def get_user_history(user_id):
    db_con = database()
    cursor = db_con.cursor()

    cursor.execute("SELECT CategoryID FROM Category")
    categories = cursor.fetchall()

    select_clause = "SELECT p.ProductID"
    for category in categories:
        category_id = category[0] # get the uid of the catefory and then append that to the new column
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

def get_recommendations(user_id, top_n=10):
    try:
        # Get all products and user history with their category vectors
        all_products = get_all_products()
        user_history = get_user_history(user_id)
        # if not user_history:
        #     #Cold start: return popular products
        #     return get_popular_products(top_n)
        # Calculate similarity between all products and user history
        user_profile = np.mean(user_history, axis=0)  # Average user preferences
        similarities = cosine_similarity([user_profile], all_products)
        # finds the indices of the top N products that have the highest
        # cosine similarity with the user's profile and sorted from most similar to least similar.
        product_indices = similarities[0].argsort()[-top_n:][::-1]
        print("product", product_indices)

        # Get the recommended product IDs
        recommended_products = [all_products[i][0] for i in product_indices]  # Product IDs

        # Upload the recommendations to the database
        history_upload(user_id, product_indices)  # Pass the indices directly to history_upload

        # Return recommended product IDs
        return recommended_products
    except Exception as e:
        logging.error(f"Recommendation error for user {user_id}: {str(e)}")
        # return get_popular_products(top_n)  # Fallback to popular products

def history_upload(userID, anrr):
    db_con = database()
    cursor = db_con.cursor()

    try:
        for item in anrr:
            #Product ID starts form index 1
            item_value = item + 1
            print(item_value)
            # Use parameterized queries to prevent SQL injection
            cursor.execute(f"INSERT INTO Recommendation (UserID, RecommendedProductID) VALUES ({userID}, {item_value});")

        # Commit the changes
        db_con.commit()

        # If you need results, you'd typically fetch them after a SELECT query
        #results = cursor.fetchall()
        #print(results)

    except Exception as e:
        print(f"Error: {e}")
        db_con.rollback()
    finally:
        # Close the cursor and connection
        cursor.close()
        db_con.close()
