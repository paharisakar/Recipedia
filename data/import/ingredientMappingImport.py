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
mycursor.execute("CREATE TABLE ingredientMapping_all (ingredient VARCHAR(255), recipe VARCHAR(65535));")
checklist =[]
path='ingredientMapping.csv'
df = pd.read_csv(path)
for index, row in df.iterrows():
            sql = "INSERT INTO ingredientMapping_all (ingredient, recipe) VALUES (%s, %s)"
            val = (row['ingredient'], row['recipe'].replace('\"',''))
            mycursor.execute(sql, val)
            mydb.commit()
