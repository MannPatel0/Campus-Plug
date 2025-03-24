import subprocess
if (subprocess.run("mysql -u root mysql < SQL_code/Schema.sql", shell=True, check=True)):
    print("successfully created the Marketplace databse")
