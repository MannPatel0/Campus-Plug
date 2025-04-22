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
        cursor.execute("DELETE FROM Recommendation WHERE UserID = %s", (user_id))
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

def get_random_products(count=0, exclude_list=None):
    db_con = database()
    cursor = db_con.cursor()

    try:
        if exclude_list and len(exclude_list) > 0:
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

def get_popular_products(count=5):
    db_con = database()
    cursor = db_con.cursor()

    try:
        cursor.execute("""
            SELECT ProductID, COUNT(*) as count
            FROM History
            GROUP BY ProductID
            ORDER BY count DESC
            LIMIT %s
        """, (count,))

        popular_products = [row[0] for row in cursor.fetchall()]

        if len(popular_products) < count:
            random_products = get_random_products(count - len(popular_products), popular_products)
            popular_products.extend(random_products)

        return popular_products

    except Exception as e:
        logging.error(f"Error getting popular products: {str(e)}")
        return get_random_products(count)
    finally:
        cursor.close()
        db_con.close()

def has_user_history_or_recommendations(user_id):
    db_con = database()
    cursor = db_con.cursor()

    try:
        cursor.execute("SELECT COUNT(*) FROM History WHERE UserID = %s", (user_id,))
        history_count = cursor.fetchone()[0]

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
            select_clause += f", MAX(CASE WHEN p.CategoryID = {category_id} THEN 1 ELSE 0 END) AS `Cat_{category_id}`"

        final_query = f"""
            {select_clause}
            FROM Product p
            GROUP BY p.ProductID;
            """

        cursor.execute(final_query)
        results = cursor.fetchall()

        final = []
        product_ids = []
        for row in results:
            text_list = list(row)
            product_id = text_list.pop(0)
            final.append(text_list)
            product_ids.append(product_id)

        cursor.close()
        db_con.close()
        return final, product_ids
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
            category_id = category[0]
            select_clause += f", MAX(CASE WHEN p.CategoryID = {category_id} THEN 1 ELSE 0 END) AS `Cat_{category_id}`"

        final_query = f"""
            {select_clause}
            FROM Product p
            WHERE p.ProductID IN (SELECT ProductID FROM History WHERE UserID = {user_id})
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
        delete_user_recommendations(user_id)

        if not has_user_history_or_recommendations(user_id):
            random_recs = get_random_products(top_n)
            recommendation_upload(user_id, random_recs)

            additional_random = get_random_products(5, random_recs)
            recommendation_upload(user_id, additional_random)

            return random_recs + additional_random

        all_product_features, all_product_ids = get_all_products()
        user_history = get_user_history(user_id)

        if not user_history:
            popular_recs = get_popular_products(top_n)
            recommendation_upload(user_id, popular_recs)

            additional_random = get_random_products(5, popular_recs)
            recommendation_upload(user_id, additional_random)

            return popular_recs + additional_random

        user_profile = np.mean(user_history, axis=0)
        similarities = cosine_similarity([user_profile], all_product_features)

        product_indices = similarities[0].argsort()[-top_n:][::-1]

        recommended_product_ids = [all_product_ids[i] for i in product_indices]
        print(recommended_product_ids)

        recommendation_upload(user_id, recommended_product_ids)

        additional_random = get_random_products(5, recommended_product_ids)
        recommendation_upload(user_id, additional_random)

        return recommended_product_ids + additional_random

    except Exception as e:
        logging.error(f"Recommendation error for user {user_id}: {str(e)}")
        random_products = get_random_products(top_n + 5)
        return random_products

def recommendation_upload(userID, products):
    db_con = database()
    cursor = db_con.cursor()

    try:
        for product_id in products:
            cursor.execute("INSERT INTO Recommendation (UserID, RecommendedProductID) VALUES (%s, %s)",
                          (userID, product_id))

        db_con.commit()

    except Exception as e:
        logging.error(f"Error uploading recommendations: {str(e)}")
        db_con.rollback()
    finally:
        cursor.close()
        db_con.close()
