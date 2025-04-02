# pip install mysql.connector

import mysql.connector

def database():
    db_connection = mysql.connector.connect(
        host = "localhost",
        port = "3306",
        user = "root",
        database = "Marketplace"
    )
    return db_connection


def get_all_products():

    db_con = database()
    cursor = db_con.cursor()
    
    # query the category Table for everything
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
        GROUP BY p.ProductID;
        """

    cursor.execute(final_query)
    results = cursor.fetchall()

    print(results[1])
    final = []
    for row in results:
        final.append(row)
        print(row)
    
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

    print(results[1])
    final = []
    for row in results:
        final.append(row)
        print(row)

    cursor.close()
    db_con.close()
    return final    

print("all products:")
get_all_products()

print("User History products:")
get_user_history(1)


def Calculate_cosin_similarity():
    pass

def Main:
    pass
