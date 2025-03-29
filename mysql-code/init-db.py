import subprocess

if (subprocess.run("mysql -u root mysql < mysql-code/Schema.sql", shell=True, check=True)):
    print("successfully created the Marketplace databse")
