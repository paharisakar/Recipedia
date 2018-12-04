import mysql.connector
import os
import pandas as pd

            
mydb = mysql.connector.connect(
  host="zergpvz.ddns.net",
  user="recipedia",
  passwd="recipedia",
  database="recipe_database"
)

def removequote(string):
    st = 0
    list = []
    for index in range(len(string)):
        if string[index] == '(' or string[index] == ')':
            list.append(index)
    print(list)
    if len(list) ==2:
        return string.replace(' '+string[list[0]:list[1]+1], '')
    else:
        return string
    
mycursor = mydb.cursor()
# mycursor.execute("CREATE TABLE recipeUrl_temp (recipeName VARCHAR(255), recipeUrl VARCHAR(65535), imageUrl VARCHAR(65535), description VARCHAR(65535), calories INT(10));")
checklist =[]
path='imageUrl.csv'

df = pd.read_csv(path,encoding = 'ISO-8859-1')
for index, row in df.iterrows():
    sql = "INSERT INTO recipeUrl_temp (recipeName, recipeUrl, imageUrl, description, calories) VALUES (%s, %s, %s, %s, %s)"
    val = (row[0].replace('\"',''), row[1], row[2], row[3].replace('\"',''), int(row[4]))
    mycursor.execute(sql, val)
    mydb.commit()

