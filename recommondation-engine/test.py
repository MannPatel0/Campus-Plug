import mysql.connector as db_con

#TODO: Specify all the required queries
query_get_all_Prod= ("SELECT * FROM Product ")


#TODO: connect with the db
def database():
    db = db_con.connect(
        host = "localhost",
        port = 3306,
        user = "root",
        database = "Marketplace"
    )

    cursor = db.cursor()
    cursor.execute(query_get_all_Prod)

    data = [None]
    for item in cursor:
        data.append(item)
        # print(item)

    print(data[1])
    cursor.close()
    db.close()



#TODO: Get All products
# Make it into a dictionary with product id and the list of category it would have
#  {Prod1:[1,0,0,0,1]} this could mean its a [elctronics, 0,0,0, kitchen]
database()
