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
    for row in results:
        print(row)

    cursor.close()

def get_user_history():
    db_con = database()
    cursor = db_con.cursor()
    user_id = 1
    query= f"""select ProductID from History where UserID={user_id}"""
    cursor.execute(query)
    data = cursor.fetchall()
    product_arr = []
    for item in data:
        product_arr.append(item[0])
        
    querydata= tuple(product_arr)
    prod_query = f"""select * from Product where ProductID IN {querydata} """
    cursor.execute(prod_query)
    res = cursor.fetchall()
    for i in res:
        print(i,"\n")



get_user_history()


#get_all_products()
